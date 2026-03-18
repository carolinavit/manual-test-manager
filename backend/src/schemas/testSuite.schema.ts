import { z } from "zod";

export const testSuiteCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  testPlanId: z.string().min(1),
});

export const testSuiteUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
});

