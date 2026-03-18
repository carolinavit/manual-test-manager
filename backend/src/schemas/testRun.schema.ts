import { z } from "zod";

export const testRunCreateSchema = z.object({
  testCaseId: z.string().min(1),
  status: z.enum(["Passed", "Failed", "Blocked"]),
  evidence: z.string().optional().nullable(),
  executedBy: z.string().min(1),
  executedAt: z.string().datetime().optional(),
});

