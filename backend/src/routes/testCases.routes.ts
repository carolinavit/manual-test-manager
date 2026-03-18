import { Router } from "express";
import { testCasesController } from "../controllers/testCases.controller";
import { testRunsController } from "../controllers/testRuns.controller";

export const testCaseRoutes = Router();

testCaseRoutes.post("/", testCasesController.create);
testCaseRoutes.get("/:id", testCasesController.get);
testCaseRoutes.patch("/:id", testCasesController.update);
testCaseRoutes.delete("/:id", testCasesController.remove);

testCaseRoutes.get("/:testCaseId/test-runs", testRunsController.listByTestCase);

