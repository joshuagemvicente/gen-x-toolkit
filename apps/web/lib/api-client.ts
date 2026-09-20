import {
  ApiErrorResponseSchema,
  GreetingListResponseSchema,
  GreetingSchema,
  HealthResponseSchema,
} from "@repo/contracts";
import type {
  Greeting,
  GreetingListResponse,
  HealthResponse,
} from "@repo/contracts";
import type { ZodType } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Raised when the API fails, or answers with something other than the contract. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const failure = ApiErrorResponseSchema.safeParse(payload);

    throw new ApiError(
      failure.success
        ? failure.data.message
        : `GET ${path} failed with status ${response.status}`,
      response.status,
    );
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new ApiError(
      `GET ${path} answered outside the @repo/contracts schema`,
      response.status,
    );
  }

  return parsed.data;
}

/**
 * The only place the web app talks to the API.
 *
 * Responses are parsed with the same schemas the API validates with, so a
 * drifting payload fails loudly here instead of rendering as `undefined`.
 */
export const apiClient = {
  getHealth(): Promise<HealthResponse> {
    return request("/health", HealthResponseSchema);
  },

  greet(name: string): Promise<Greeting> {
    return request(`/greetings?name=${encodeURIComponent(name)}`, GreetingSchema);
  },

  getRecentGreetings(): Promise<GreetingListResponse> {
    return request("/greetings/recent", GreetingListResponseSchema);
  },
};
