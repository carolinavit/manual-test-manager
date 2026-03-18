"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRunsService = void 0;
const prisma_1 = require("../db/prisma");
const apiError_1 = require("../utils/apiError");
exports.testRunsService = {
    async list(filters) {
        return prisma_1.prisma.testRun.findMany({
            where: {
                ...(filters.status ? { status: filters.status } : {}),
                ...(filters.testCaseId ? { testCaseId: filters.testCaseId } : {}),
                ...(filters.testSuiteId || filters.testPlanId
                    ? {
                        testCase: {
                            ...(filters.testSuiteId ? { testSuiteId: filters.testSuiteId } : {}),
                            ...(filters.testPlanId
                                ? { testSuite: { testPlanId: filters.testPlanId } }
                                : {}),
                        },
                    }
                    : {}),
            },
            orderBy: { executedAt: "desc" },
            include: {
                testCase: {
                    select: {
                        id: true,
                        title: true,
                        testSuite: { select: { id: true, name: true, testPlanId: true } },
                    },
                },
            },
        });
    },
    async listByTestCase(testCaseId) {
        return prisma_1.prisma.testRun.findMany({
            where: { testCaseId },
            orderBy: { executedAt: "desc" },
        });
    },
    async create(input) {
        const testCase = await prisma_1.prisma.testCase.findUnique({ where: { id: input.testCaseId } });
        if (!testCase)
            throw (0, apiError_1.apiError)(404, "Test Case não encontrado.");
        return prisma_1.prisma.testRun.create({
            data: {
                testCaseId: input.testCaseId,
                status: input.status,
                evidence: input.evidence ?? null,
                executedBy: input.executedBy,
                executedAt: input.executedAt ?? new Date(),
            },
        });
    },
    async dashboard(filters) {
        const where = filters?.testPlanId
            ? { testCase: { testSuite: { testPlanId: filters.testPlanId } } }
            : undefined;
        const totalExecuted = await prisma_1.prisma.testRun.count({ where });
        const passed = await prisma_1.prisma.testRun.count({ where: { ...(where ?? {}), status: "Passed" } });
        const failed = await prisma_1.prisma.testRun.count({ where: { ...(where ?? {}), status: "Failed" } });
        const blocked = await prisma_1.prisma.testRun.count({ where: { ...(where ?? {}), status: "Blocked" } });
        const passRate = totalExecuted === 0 ? 0 : Math.round((passed / totalExecuted) * 1000) / 10;
        return { totalExecuted, passed, failed, blocked, passRate };
    },
};
