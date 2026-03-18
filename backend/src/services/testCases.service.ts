import { prisma } from "../db/prisma";
import { apiError } from "../utils/apiError";

type Step = { action: string; data?: string | null };

export const testCasesService = {
  async listBySuite(testSuiteId: string, filters?: { q?: string }) {
    const q = filters?.q?.trim();
    return prisma.testCase.findMany({
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

  async getById(id: string, opts?: { includeRuns?: boolean }) {
    const testCase = await prisma.testCase.findUnique({
      where: { id },
      include: opts?.includeRuns
        ? { testRuns: { orderBy: { executedAt: "desc" } } }
        : { _count: { select: { testRuns: true } } },
    });
    if (!testCase) throw apiError(404, "Test Case não encontrado.");
    return testCase;
  },

  async create(input: {
    title: string;
    preconditions?: string | null;
    steps: Step[];
    expectedResult: string;
    testSuiteId: string;
  }) {
    const suite = await prisma.testSuite.findUnique({ where: { id: input.testSuiteId } });
    if (!suite) throw apiError(404, "Test Suite não encontrada.");

    return prisma.testCase.create({
      data: {
        title: input.title,
        preconditions: input.preconditions ?? null,
        steps: input.steps,
        expectedResult: input.expectedResult,
        testSuiteId: input.testSuiteId,
      },
    });
  },

  async update(
    id: string,
    input: {
      title?: string;
      preconditions?: string | null;
      steps?: Step[];
      expectedResult?: string;
    },
  ) {
    await this.getById(id);
    return prisma.testCase.update({
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

  async remove(id: string) {
    await this.getById(id);
    await prisma.testCase.delete({ where: { id } });
    return { ok: true };
  },
};

