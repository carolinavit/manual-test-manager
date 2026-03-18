"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSuitesController = void 0;
const testSuite_schema_1 = require("../schemas/testSuite.schema");
const testSuites_service_1 = require("../services/testSuites.service");
exports.testSuitesController = {
    async listByPlan(req, res) {
        const testPlanId = req.params["testPlanId"];
        const items = await testSuites_service_1.testSuitesService.listByPlan(testPlanId);
        return res.json(items);
    },
    async get(req, res) {
        const includeCases = req.query["includeCases"] === "true";
        const id = req.params["id"];
        const item = await testSuites_service_1.testSuitesService.getById(id, { includeCases });
        return res.json(item);
    },
    async create(req, res) {
        const input = testSuite_schema_1.testSuiteCreateSchema.parse(req.body);
        const item = await testSuites_service_1.testSuitesService.create(input);
        return res.status(201).json(item);
    },
    async update(req, res) {
        const input = testSuite_schema_1.testSuiteUpdateSchema.parse(req.body);
        const id = req.params["id"];
        const item = await testSuites_service_1.testSuitesService.update(id, input);
        return res.json(item);
    },
    async remove(req, res) {
        const id = req.params["id"];
        const result = await testSuites_service_1.testSuitesService.remove(id);
        return res.json(result);
    },
};
