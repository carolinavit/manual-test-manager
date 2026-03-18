"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSuiteUpdateSchema = exports.testSuiteCreateSchema = void 0;
const zod_1 = require("zod");
exports.testSuiteCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional().nullable(),
    testPlanId: zod_1.z.string().min(1),
});
exports.testSuiteUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional().nullable(),
});
