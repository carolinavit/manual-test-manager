import cors from "cors";
import express from "express";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env["CORS_ORIGIN"]?.split(",").map((s) => s.trim()) ?? "*",
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}

