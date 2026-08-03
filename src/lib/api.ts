import { getToken } from "./auth";
import type { ApiFailure, ApiSuccess } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiClientError extends Error {
  status: number;
  errorDetails: unknown;

  constructor(status: number, message: string, errorDetails: unknown) {
    super(message);
    this.status = status;
    this.errorDetails = errorDetails;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean; // attach Authorization header (default true)
}

/**
 * Central fetch wrapper. Every backend response follows
 * { success, message, data } or { success, message, errorDetails }.
 * This throws ApiClientError on failure so React Query / callers can
 * handle it uniformly (toast, inline form errors, etc.)
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      (finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: ApiSuccess<T> | ApiFailure | null = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON response (e.g. network-level failure)
  }

  if (!res.ok || !json || json.success === false) {
    const failure = json as ApiFailure | null;
    throw new ApiClientError(
      res.status,
      failure?.message || "Something went wrong. Please try again.",
      failure?.errorDetails ?? null
    );
  }

  return (json as ApiSuccess<T>).data;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
