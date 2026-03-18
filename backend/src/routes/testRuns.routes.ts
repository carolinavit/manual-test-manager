import { Router } from "express";
import { testRunsController } from "../controllers/testRuns.controller";

export const testRunRoutes = Router();

testRunRoutes.get("/", testRunsController.list);
testRunRoutes.post("/", testRunsController.create);

