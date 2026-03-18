"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
exports.dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes.get("/", dashboard_controller_1.dashboardController.get);
