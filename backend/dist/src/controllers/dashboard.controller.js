"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const testRuns_service_1 = require("../services/testRuns.service");
exports.dashboardController = {
    async get(req, res) {
        const testPlanId = typeof req.query["testPlanId"] === "string" ? req.query["testPlanId"] : undefined;
        const metrics = await testRuns_service_1.testRunsService.dashboard({ testPlanId });
        return res.json(metrics);
    },
};
