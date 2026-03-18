export function apiError(status: number, message: string, details?: unknown) {
  return { status, message, details };
}

