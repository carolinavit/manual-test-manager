"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCaseUpdateSchema = exports.testCaseCreateSchema = exports.testStepSchema = void 0;
const zod_1 = require("zod");
exports.testStepSchema = zod_1.z.object({
    action: zod_1.z.string().min(1),
    data: zod_1.z.string().optional().nullable(),
});
exports.testCaseCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    preconditions: zod_1.z.string().optional().nullable(),
    steps: zod_1.z.array(exports.testStepSchema).min(1),
    expectedResult: zod_1.z.string().min(1),
    testSuiteId: zod_1.z.string().min(1),
});
exports.testCaseUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    preconditions: zod_1.z.string().optional().nullable(),
    steps: zod_1.z.array(exports.testStepSchema).min(1).optional(),
    expectedResult: zod_1.z.string().min(1).optional(),
});
