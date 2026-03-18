import { z } from "zod";

export const testPlanCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
});

export const testPlanUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
});

