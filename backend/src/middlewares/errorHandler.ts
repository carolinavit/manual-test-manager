import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Payload inválido.",
      details: err.flatten(),
    });
  }

  if (isApiError(err)) {
    return res.status(err.status).json({
      error: "ApiError",
      message: err.message,
      details: err.details,
    });
  }

  console.error(err);
  return res.status(500).json({
    error: "InternalServerError",
    message: "Erro inesperado.",
  });
}

