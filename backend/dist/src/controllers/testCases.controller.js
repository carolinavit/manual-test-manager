"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCasesController = void 0;
const testCase_schema_1 = require("../schemas/testCase.schema");
const testCases_service_1 = require("../services/testCases.service");
exports.testCasesController = {
    async listBySuite(req, res) {
        const q = typeof req.query["q"] === "string" ? req.query["q"] : undefined;
        const testSuiteId = req.params["testSuiteId"];
        const items = await testCases_service_1.testCasesService.listBySuite(testSuiteId, { q });
        return res.json(items);
    },
    async get(req, res) {
        const includeRuns = req.query["includeRuns"] === "true";
        const id = req.params["id"];
        const item = await testCases_service_1.testCasesService.getById(id, { includeRuns });
        return res.json(item);
    },
    async create(req, res) {
        const input = testCase_schema_1.testCaseCreateSchema.parse(req.body);
        const item = await testCases_service_1.testCasesService.create(input);
        return res.status(201).json(item);
    },
    async update(req, res) {
        const input = testCase_schema_1.testCaseUpdateSchema.parse(req.body);
        const id = req.params["id"];
        const item = await testCases_service_1.testCasesService.update(id, input);
        return res.json(item);
    },
    async remove(req, res) {
        const id = req.params["id"];
        const result = await testCases_service_1.testCasesService.remove(id);
        return res.json(result);
    },
};
