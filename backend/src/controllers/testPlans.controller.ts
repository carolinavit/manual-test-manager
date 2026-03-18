import type { Request, Response } from "express";
import { testPlanCreateSchema, testPlanUpdateSchema } from "../schemas/testPlan.schema";
import { testPlansService } from "../services/testPlans.service";

export const testPlansController = {
  async list(req: Request, res: Response) {
    const q = typeof req.query["q"] === "string" ? req.query["q"] : undefined;
    const items = await testPlansService.list({ q });
    return res.json(items);
  },

  async get(req: Request, res: Response) {
    const hierarchy = req.query["hierarchy"] === "true";
    const id = req.params["id"] as string;
    const item = await testPlansService.getById(id, { hierarchy });
    return res.json(item);
  },

  async create(req: Request, res: Response) {
    const input = testPlanCreateSchema.parse(req.body);
    const item = await testPlansService.create(input);
    return res.status(201).json(item);
  },

  async update(req: Request, res: Response) {
    const input = testPlanUpdateSchema.parse(req.body);
    const id = req.params["id"] as string;
    const item = await testPlansService.update(id, input);
    return res.json(item);
  },

  async remove(req: Request, res: Response) {
    const id = req.params["id"] as string;
    const result = await testPlansService.remove(id);
    return res.json(result);
  },
};

