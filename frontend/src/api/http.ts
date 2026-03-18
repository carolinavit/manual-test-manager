const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status?: number;
  details?: unknown;
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = await parseJsonSafe(res);
  if (!res.ok) {
    const err = new ApiError(
      (body && typeof body === "object" && "message" in body ? String((body as any).message) : null) ||
        `Erro HTTP ${res.status}`,
    );
    err.status = res.status;
    err.details = body;
    throw err;
  }

  return body as T;
}

