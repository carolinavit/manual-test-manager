import { TestRunStatus } from "@prisma/client";
import { prisma } from "../db/prisma";
import { apiError } from "../utils/apiError";

export type TestRunListFilters = {
  status?: TestRunStatus;
  testCaseId?: string;
  testSuiteId?: string;
  testPlanId?: string;
};

export const testRunsService = {
  async list(filters: TestRunListFilters) {
    return prisma.testRun.findMany({
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

  async listByTestCase(testCaseId: string) {
    return prisma.testRun.findMany({
      where: { testCaseId },
      orderBy: { executedAt: "desc" },
    });
  },

  async create(input: {
    testCaseId: string;
    status: TestRunStatus;
    evidence?: string | null;
    executedBy: string;
    executedAt?: Date;
  }) {
    const testCase = await prisma.testCase.findUnique({ where: { id: input.testCaseId } });
    if (!testCase) throw apiError(404, "Test Case não encontrado.");

    return prisma.testRun.create({
      data: {
        testCaseId: input.testCaseId,
        status: input.status,
        evidence: input.evidence ?? null,
        executedBy: input.executedBy,
        executedAt: input.executedAt ?? new Date(),
      },
    });
  },

  async dashboard(filters?: { testPlanId?: string }) {
    const where = filters?.testPlanId
      ? { testCase: { testSuite: { testPlanId: filters.testPlanId } } }
      : undefined;

    const totalExecuted = await prisma.testRun.count({ where });
    const passed = await prisma.testRun.count({ where: { ...(where ?? {}), status: "Passed" } });
    const failed = await prisma.testRun.count({ where: { ...(where ?? {}), status: "Failed" } });
    const blocked = await prisma.testRun.count({ where: { ...(where ?? {}), status: "Blocked" } });

    const passRate = totalExecuted === 0 ? 0 : Math.round((passed / totalExecuted) * 1000) / 10;

    return { totalExecuted, passed, failed, blocked, passRate };
  },
};

