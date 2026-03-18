"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function isApiError(err) {
    return (typeof err === "object" &&
        err !== null &&
        "status" in err &&
        typeof err.status === "number" &&
        "message" in err &&
        typeof err.message === "string");
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
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
