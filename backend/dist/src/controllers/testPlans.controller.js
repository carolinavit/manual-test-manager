"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPlansController = void 0;
const testPlan_schema_1 = require("../schemas/testPlan.schema");
const testPlans_service_1 = require("../services/testPlans.service");
exports.testPlansController = {
    async list(req, res) {
        const q = typeof req.query["q"] === "string" ? req.query["q"] : undefined;
        const items = await testPlans_service_1.testPlansService.list({ q });
        return res.json(items);
    },
    async get(req, res) {
        const hierarchy = req.query["hierarchy"] === "true";
        const id = req.params["id"];
        const item = await testPlans_service_1.testPlansService.getById(id, { hierarchy });
        return res.json(item);
    },
    async create(req, res) {
        const input = testPlan_schema_1.testPlanCreateSchema.parse(req.body);
        const item = await testPlans_service_1.testPlansService.create(input);
        return res.status(201).json(item);
    },
    async update(req, res) {
        const input = testPlan_schema_1.testPlanUpdateSchema.parse(req.body);
        const id = req.params["id"];
        const item = await testPlans_service_1.testPlansService.update(id, input);
        return res.json(item);
    },
    async remove(req, res) {
        const id = req.params["id"];
        const result = await testPlans_service_1.testPlansService.remove(id);
        return res.json(result);
    },
};
