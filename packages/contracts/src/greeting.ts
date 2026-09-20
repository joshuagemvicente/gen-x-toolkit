import { z } from "zod";

/** Longest `name` the greeting endpoints accept. */
export const GREETING_NAME_MAX_LENGTH = 64;

/** Contract for the `?name=` query string of `GET /greetings`. */
export const GreetingRequestSchema = z.object({
  name: z.string().trim().min(1).max(GREETING_NAME_MAX_LENGTH),
});

export type GreetingRequest = z.infer<typeof GreetingRequestSchema>;

/** Contract of a single greeting, shared by both greeting endpoints. */
export const GreetingSchema = z.object({
  message: z.string().min(1),
  greetedAt: z.iso.datetime(),
});

export type Greeting = z.infer<typeof GreetingSchema>;

/** Contract for `GET /greetings/recent`. */
export const GreetingListResponseSchema = z.object({
  items: z.array(GreetingSchema),
  total: z.number().int().nonnegative(),
});

export type GreetingListResponse = z.infer<typeof GreetingListResponseSchema>;
