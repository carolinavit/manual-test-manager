"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiError = apiError;
function apiError(status, message, details) {
    return { status, message, details };
}
