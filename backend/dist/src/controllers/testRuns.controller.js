"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRunsController = void 0;
const testRun_schema_1 = require("../schemas/testRun.schema");
const testRuns_service_1 = require("../services/testRuns.service");
exports.testRunsController = {
    async list(req, res) {
        const statusRaw = typeof req.query["status"] === "string" ? req.query["status"] : undefined;
        const status = statusRaw && ["Passed", "Failed", "Blocked"].includes(statusRaw)
            ? statusRaw
            : undefined;
        const testCaseId = typeof req.query["testCaseId"] === "string" ? req.query["testCaseId"] : undefined;
        const testSuiteId = typeof req.query["testSuiteId"] === "string" ? req.query["testSuiteId"] : undefined;
        const testPlanId = typeof req.query["testPlanId"] === "string" ? req.query["testPlanId"] : undefined;
        const items = await testRuns_service_1.testRunsService.list({ status, testCaseId, testSuiteId, testPlanId });
        return res.json(items);
    },
    async listByTestCase(req, res) {
        const testCaseId = req.params["testCaseId"];
        const items = await testRuns_service_1.testRunsService.listByTestCase(testCaseId);
        return res.json(items);
    },
    async create(req, res) {
        const input = testRun_schema_1.testRunCreateSchema.parse(req.body);
        const item = await testRuns_service_1.testRunsService.create({
            ...input,
            status: input.status,
            executedAt: input.executedAt ? new Date(input.executedAt) : undefined,
        });
        return res.status(201).json(item);
    },
};
