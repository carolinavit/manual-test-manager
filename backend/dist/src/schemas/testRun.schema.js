"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRunCreateSchema = void 0;
const zod_1 = require("zod");
exports.testRunCreateSchema = zod_1.z.object({
    testCaseId: zod_1.z.string().min(1),
    status: zod_1.z.enum(["Passed", "Failed", "Blocked"]),
    evidence: zod_1.z.string().optional().nullable(),
    executedBy: zod_1.z.string().min(1),
    executedAt: zod_1.z.string().datetime().optional(),
});
