import { Router } from "express";
import { testPlanRoutes } from "./testPlans.routes";
import { testSuiteRoutes } from "./testSuites.routes";
import { testCaseRoutes } from "./testCases.routes";
import { testRunRoutes } from "./testRuns.routes";
import { dashboardRoutes } from "./dashboard.routes";

export const routes = Router();

routes.use("/test-plans", testPlanRoutes);
routes.use("/test-suites", testSuiteRoutes);
routes.use("/test-cases", testCaseRoutes);
routes.use("/test-runs", testRunRoutes);
routes.use("/dashboard", dashboardRoutes);

