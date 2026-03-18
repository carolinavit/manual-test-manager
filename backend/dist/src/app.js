"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const errorHandler_1 = require("./middlewares/errorHandler");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: process.env["CORS_ORIGIN"]?.split(",").map((s) => s.trim()) ?? "*",
    }));
    app.use(express_1.default.json({ limit: "1mb" }));
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/api", routes_1.routes);
    app.use(errorHandler_1.errorHandler);
    return app;
}
