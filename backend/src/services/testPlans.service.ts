import { prisma } from "../db/prisma";
import { apiError } from "../utils/apiError";

export type TestPlanListFilters = {
  q?: string;
};

export const testPlansService = {
  async list(filters: TestPlanListFilters) {
    const q = filters.q?.trim();
    return prisma.testPlan.findMany({
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

  async getById(id: string, opts?: { hierarchy?: boolean }) {
    const plan = await prisma.testPlan.findUnique({
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
    if (!plan) throw apiError(404, "Test Plan não encontrado.");
    return plan;
  },

  async create(input: { name: string; description?: string | null }) {
    return prisma.testPlan.create({
      data: {
        name: input.name,
        description: input.description ?? null,
      },
    });
  },

  async update(id: string, input: { name?: string; description?: string | null }) {
    await this.getById(id);
    return prisma.testPlan.update({
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
    await prisma.testPlan.delete({ where: { id } });
    return { ok: true };
  },
};

