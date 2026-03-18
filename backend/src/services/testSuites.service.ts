import { prisma } from "../db/prisma";
import { apiError } from "../utils/apiError";

export const testSuitesService = {
  async listByPlan(testPlanId: string) {
    return prisma.testSuite.findMany({
      where: { testPlanId },
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { testCases: true } } },
    });
  },

  async getById(id: string, opts?: { includeCases?: boolean }) {
    const suite = await prisma.testSuite.findUnique({
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
    if (!suite) throw apiError(404, "Test Suite não encontrada.");
    return suite;
  },

  async create(input: {
    name: string;
    description?: string | null;
    testPlanId: string;
  }) {
    const plan = await prisma.testPlan.findUnique({ where: { id: input.testPlanId } });
    if (!plan) throw apiError(404, "Test Plan não encontrado.");

    return prisma.testSuite.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        testPlanId: input.testPlanId,
      },
    });
  },

  async update(id: string, input: { name?: string; description?: string | null }) {
    await this.getById(id);
    return prisma.testSuite.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined
          ? { description: input.description ?? null }
          : {}),
      },
    });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.testSuite.delete({ where: { id } });
    return { ok: true };
  },
};

