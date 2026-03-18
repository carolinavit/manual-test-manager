"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPlansService = void 0;
const prisma_1 = require("../db/prisma");
const apiError_1 = require("../utils/apiError");
exports.testPlansService = {
    async list(filters) {
        const q = filters.q?.trim();
        return prisma_1.prisma.testPlan.findMany({
            where: q
                ? {
                    OR: [
                        { name: { contains: q } },
                        { description: { contains: q } },
                    ],
                }
                : undefined,
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { testSuites: true } },
            },
        });
    },
    async getById(id, opts) {
        const plan = await prisma_1.prisma.testPlan.findUnique({
            where: { id },
            include: opts?.hierarchy
                ? {
                    testSuites: {
                        orderBy: { createdAt: "asc" },
                        include: {
                            testCases: {
                                orderBy: { createdAt: "asc" },
                                include: {
                                    _count: { select: { testRuns: true } },
                                },
                            },
                        },
                    },
                }
                : {
                    _count: { select: { testSuites: true } },
                },
        });
        if (!plan)
            throw (0, apiError_1.apiError)(404, "Test Plan não encontrado.");
        return plan;
    },
    async create(input) {
        return prisma_1.prisma.testPlan.create({
            data: {
                name: input.name,
                description: input.description ?? null,
            },
        });
    },
    async update(id, input) {
        await this.getById(id);
        return prisma_1.prisma.testPlan.update({
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
        await prisma_1.prisma.testPlan.delete({ where: { id } });
        return { ok: true };
    },
};
