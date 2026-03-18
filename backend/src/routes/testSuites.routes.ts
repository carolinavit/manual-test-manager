import { Router } from "express";
import { testSuitesController } from "../controllers/testSuites.controller";
import { testCasesController } from "../controllers/testCases.controller";

export const testSuiteRoutes = Router();

testSuiteRoutes.post("/", testSuitesController.create);
testSuiteRoutes.get("/:id", testSuitesController.get);
testSuiteRoutes.patch("/:id", testSuitesController.update);
testSuiteRoutes.delete("/:id", testSuitesController.remove);

testSuiteRoutes.get("/:testSuiteId/test-cases", testCasesController.listBySuite);

