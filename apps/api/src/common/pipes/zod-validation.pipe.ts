import { BadRequestException, Injectable } from "@nestjs/common";
import type { PipeTransform } from "@nestjs/common";
import { ApiValidationErrorPayloadSchema } from "@repo/contracts";
import type { ZodType } from "zod";

/**
 * Validates an incoming value (query, body, param) against a contract from
 * `@repo/contracts` and hands the handler a fully typed value.
 *
 * The pipe owns no rules of its own — the schema is the single source of
 * truth, shared with the web app.
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      throw new BadRequestException(
        ApiValidationErrorPayloadSchema.parse({
          message: "Request validation failed",
          fields: parsed.error.issues.map((issue) => ({
            path: issue.path.map((segment) => String(segment)).join(".") || "request",
            message: issue.message,
          })),
        }),
      );
    }

    return parsed.data;
  }
}
