"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRunRoutes = void 0;
const express_1 = require("express");
const testRuns_controller_1 = require("../controllers/testRuns.controller");
exports.testRunRoutes = (0, express_1.Router)();
exports.testRunRoutes.get("/", testRuns_controller_1.testRunsController.list);
exports.testRunRoutes.post("/", testRuns_controller_1.testRunsController.create);
