import { z } from "zod";

/** A single field level validation failure. */
export const ApiFieldErrorSchema = z.object({
  path: z.string().min(1),
  message: z.string().min(1),
});

export type ApiFieldError = z.infer<typeof ApiFieldErrorSchema>;

export const ApiFieldErrorListSchema = z.array(ApiFieldErrorSchema).min(1);

/**
 * The error envelope every failing request returns, produced by the API's
 * global exception filter and parsed by the web app's API client.
 *
 * A single shape for all failures means callers never have to guess whether a
 * response carries `error`, `errors`, `detail` or `message`.
 */
export const ApiErrorResponseSchema = z.object({
  statusCode: z.number().int(),
  error: z.string().min(1),
  message: z.string().min(1),
  path: z.string().min(1),
  timestamp: z.iso.datetime(),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

/**
 * What a validation failure carries before the envelope is added around it:
 * the validation pipe throws exactly this shape and the exception filter
 * parses it back, so both sides agree on one definition.
 */
export const ApiValidationErrorPayloadSchema = z.object({
  message: z.string().min(1),
  fields: ApiFieldErrorListSchema,
});

export type ApiValidationErrorPayload = z.infer<
  typeof ApiValidationErrorPayloadSchema
>;

/** The complete response a client receives for a validation failure. */
export const ApiValidationErrorResponseSchema = ApiErrorResponseSchema.extend({
  fields: ApiFieldErrorListSchema,
});

export type ApiValidationErrorResponse = z.infer<
  typeof ApiValidationErrorResponseSchema
>;
