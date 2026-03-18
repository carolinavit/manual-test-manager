"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPlanUpdateSchema = exports.testPlanCreateSchema = void 0;
const zod_1 = require("zod");
exports.testPlanCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional().nullable(),
});
exports.testPlanUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional().nullable(),
});
