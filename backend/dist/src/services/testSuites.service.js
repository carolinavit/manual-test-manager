"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSuitesService = void 0;
const prisma_1 = require("../db/prisma");
const apiError_1 = require("../utils/apiError");
exports.testSuitesService = {
    async listByPlan(testPlanId) {
        return prisma_1.prisma.testSuite.findMany({
            where: { testPlanId },
            orderBy: { createdAt: "asc" },
            include: { _count: { select: { testCases: true } } },
        });
    },
    async getById(id, opts) {
        const suite = await prisma_1.prisma.testSuite.findUnique({
            where: { id },
            include: opts?.includeCases
                ? {
                    testCases: {
                        orderBy: { createdAt: "asc" },
                        include: { _count: { select: { testRuns: true } } },
                    },
                }
                : { _count: { select: { testCases: true } } },
        });
        if (!suite)
            throw (0, apiError_1.apiError)(404, "Test Suite não encontrada.");
        return suite;
    },
    async create(input) {
        const plan = await prisma_1.prisma.testPlan.findUnique({ where: { id: input.testPlanId } });
        if (!plan)
            throw (0, apiError_1.apiError)(404, "Test Plan não encontrado.");
        return prisma_1.prisma.testSuite.create({
            data: {
                name: input.name,
                description: input.description ?? null,
                testPlanId: input.testPlanId,
            },
        });
    },
    async update(id, input) {
        await this.getById(id);
        return prisma_1.prisma.testSuite.update({
            where: { id },
            data: {
                ...(input.name !== undefined ? { name: input.name } : {}),
                ...(input.description !== undefined
                    ? { description: input.description ?? null }
                    : {}),
            },
        });
    },
    async remove(id) {
        await this.getById(id);
        await prisma_1.prisma.testSuite.delete({ where: { id } });
        return { ok: true };
    },
};
