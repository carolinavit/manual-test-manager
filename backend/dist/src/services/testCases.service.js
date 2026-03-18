"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCasesService = void 0;
const prisma_1 = require("../db/prisma");
const apiError_1 = require("../utils/apiError");
exports.testCasesService = {
    async listBySuite(testSuiteId, filters) {
        const q = filters?.q?.trim();
        return prisma_1.prisma.testCase.findMany({
            where: {
                testSuiteId,
                ...(q
                    ? {
                        OR: [
                            { title: { contains: q } },
                            { preconditions: { contains: q } },
                            { expectedResult: { contains: q } },
                        ],
                    }
                    : {}),
            },
            orderBy: { createdAt: "asc" },
            include: {
                _count: { select: { testRuns: true } },
            },
        });
    },
    async getById(id, opts) {
        const testCase = await prisma_1.prisma.testCase.findUnique({
            where: { id },
            include: opts?.includeRuns
                ? { testRuns: { orderBy: { executedAt: "desc" } } }
                : { _count: { select: { testRuns: true } } },
        });
        if (!testCase)
            throw (0, apiError_1.apiError)(404, "Test Case não encontrado.");
        return testCase;
    },
    async create(input) {
        const suite = await prisma_1.prisma.testSuite.findUnique({ where: { id: input.testSuiteId } });
        if (!suite)
            throw (0, apiError_1.apiError)(404, "Test Suite não encontrada.");
        return prisma_1.prisma.testCase.create({
            data: {
                title: input.title,
                preconditions: input.preconditions ?? null,
                steps: input.steps,
                expectedResult: input.expectedResult,
                testSuiteId: input.testSuiteId,
            },
        });
    },
    async update(id, input) {
        await this.getById(id);
        return prisma_1.prisma.testCase.update({
            where: { id },
            data: {
                ...(input.title !== undefined ? { title: input.title } : {}),
                ...(input.preconditions !== undefined
                    ? { preconditions: input.preconditions ?? null }
                    : {}),
                ...(input.steps !== undefined ? { steps: input.steps } : {}),
                ...(input.expectedResult !== undefined ? { expectedResult: input.expectedResult } : {}),
            },
        });
    },
    async remove(id) {
        await this.getById(id);
        await prisma_1.prisma.testCase.delete({ where: { id } });
        return { ok: true };
    },
};
