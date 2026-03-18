import type { Request, Response } from "express";
import { testSuiteCreateSchema, testSuiteUpdateSchema } from "../schemas/testSuite.schema";
import { testSuitesService } from "../services/testSuites.service";

export const testSuitesController = {
  async listByPlan(req: Request, res: Response) {
    const testPlanId = req.params["testPlanId"] as string;
    const items = await testSuitesService.listByPlan(testPlanId);
    return res.json(items);
  },

  async get(req: Request, res: Response) {
    const includeCases = req.query["includeCases"] === "true";
    const id = req.params["id"] as string;
    const item = await testSuitesService.getById(id, { includeCases });
    return res.json(item);
  },

  async create(req: Request, res: Response) {
    const input = testSuiteCreateSchema.parse(req.body);
    const item = await testSuitesService.create(input);
    return res.status(201).json(item);
  },

  async update(req: Request, res: Response) {
    const input = testSuiteUpdateSchema.parse(req.body);
    const id = req.params["id"] as string;
    const item = await testSuitesService.update(id, input);
    return res.json(item);
  },

  async remove(req: Request, res: Response) {
    const id = req.params["id"] as string;
    const result = await testSuitesService.remove(id);
    return res.json(result);
  },
};

