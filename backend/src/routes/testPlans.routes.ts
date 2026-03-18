import { Router } from "express";
import { testPlansController } from "../controllers/testPlans.controller";
import { testSuitesController } from "../controllers/testSuites.controller";

export const testPlanRoutes = Router();

testPlanRoutes.get("/", testPlansController.list);
testPlanRoutes.post("/", testPlansController.create);
testPlanRoutes.get("/:id", testPlansController.get);
testPlanRoutes.patch("/:id", testPlansController.update);
testPlanRoutes.delete("/:id", testPlansController.remove);

testPlanRoutes.get("/:testPlanId/test-suites", testSuitesController.listByPlan);

