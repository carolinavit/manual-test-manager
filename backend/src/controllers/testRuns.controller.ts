import type { Request, Response } from "express";
import { TestRunStatus } from "@prisma/client";
import { testRunCreateSchema } from "../schemas/testRun.schema";
import { testRunsService } from "../services/testRuns.service";

export const testRunsController = {
  async list(req: Request, res: Response) {
    const statusRaw = typeof req.query["status"] === "string" ? req.query["status"] : undefined;
    const status =
      statusRaw && ["Passed", "Failed", "Blocked"].includes(statusRaw)
        ? (statusRaw as TestRunStatus)
        : undefined;

    const testCaseId = typeof req.query["testCaseId"] === "string" ? req.query["testCaseId"] : undefined;
    const testSuiteId = typeof req.query["testSuiteId"] === "string" ? req.query["testSuiteId"] : undefined;
    const testPlanId = typeof req.query["testPlanId"] === "string" ? req.query["testPlanId"] : undefined;

    const items = await testRunsService.list({ status, testCaseId, testSuiteId, testPlanId });
    return res.json(items);
  },

  async listByTestCase(req: Request, res: Response) {
    const testCaseId = req.params["testCaseId"] as string;
    const items = await testRunsService.listByTestCase(testCaseId);
    return res.json(items);
  },

  async create(req: Request, res: Response) {
    const input = testRunCreateSchema.parse(req.body);
    const item = await testRunsService.create({
      ...input,
      status: input.status as TestRunStatus,
      executedAt: input.executedAt ? new Date(input.executedAt) : undefined,
    });
    return res.status(201).json(item);
  },
};

