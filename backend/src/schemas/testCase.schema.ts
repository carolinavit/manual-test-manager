import { z } from "zod";

export const testStepSchema = z.object({
  action: z.string().min(1),
  data: z.string().optional().nullable(),
});

export const testCaseCreateSchema = z.object({
  title: z.string().min(1),
  preconditions: z.string().optional().nullable(),
  steps: z.array(testStepSchema).min(1),
  expectedResult: z.string().min(1),
  testSuiteId: z.string().min(1),
});

export const testCaseUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  preconditions: z.string().optional().nullable(),
  steps: z.array(testStepSchema).min(1).optional(),
  expectedResult: z.string().min(1).optional(),
});

