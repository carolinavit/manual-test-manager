import type { Request, Response } from "express";
import { testCaseCreateSchema, testCaseUpdateSchema } from "../schemas/testCase.schema";
import { testCasesService } from "../services/testCases.service";

export const testCasesController = {
  async listBySuite(req: Request, res: Response) {
    const q = typeof req.query["q"] === "string" ? req.query["q"] : undefined;
    const testSuiteId = req.params["testSuiteId"] as string;
    const items = await testCasesService.listBySuite(testSuiteId, { q });
    return res.json(items);
  },

  async get(req: Request, res: Response) {
    const includeRuns = req.query["includeRuns"] === "true";
    const id = req.params["id"] as string;
    const item = await testCasesService.getById(id, { includeRuns });
    return res.json(item);
  },

  async create(req: Request, res: Response) {
    const input = testCaseCreateSchema.parse(req.body);
    const item = await testCasesService.create(input);
    return res.status(201).json(item);
  },

  async update(req: Request, res: Response) {
    const input = testCaseUpdateSchema.parse(req.body);
    const id = req.params["id"] as string;
    const item = await testCasesService.update(id, input);
    return res.json(item);
  },

  async remove(req: Request, res: Response) {
    const id = req.params["id"] as string;
    const result = await testCasesService.remove(id);
    return res.json(result);
  },
};

