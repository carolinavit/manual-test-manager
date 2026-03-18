import type { Request, Response } from "express";
import { testRunsService } from "../services/testRuns.service";

export const dashboardController = {
  async get(req: Request, res: Response) {
    const testPlanId = typeof req.query["testPlanId"] === "string" ? req.query["testPlanId"] : undefined;
    const metrics = await testRunsService.dashboard({ testPlanId });
    return res.json(metrics);
  },
};

