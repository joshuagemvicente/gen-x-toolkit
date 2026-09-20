import { Catch, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { ApiValidationErrorPayloadSchema } from "@repo/contracts";
import type {
  ApiErrorResponse,
  ApiValidationErrorResponse,
} from "@repo/contracts";
import type { Request, Response } from "express";

/**
 * Turns every failure into the one error envelope declared in
 * `@repo/contracts`, so clients parse errors the way they parse data.
 *
 * Unexpected failures (5xx) are logged and reported as a generic message:
 * internals never leak to the caller.
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body: unknown =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const validation = ApiValidationErrorPayloadSchema.safeParse(body);
    const serverFailure = status >= HttpStatus.INTERNAL_SERVER_ERROR;

    if (serverFailure) {
      this.logger.error(
        `${request.method} ${request.url} failed: ${
          exception instanceof Error ? exception.message : String(exception)
        }`,
      );
    }

    const payload: ApiErrorResponse | ApiValidationErrorResponse = {
      statusCode: status,
      error: HttpStatus[status] ?? "Error",
      message:
        (validation.success && validation.data.message) ||
        (typeof body === "string" && body) ||
        (serverFailure ? "Internal server error" : "Request failed"),
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(validation.success ? { fields: validation.data.fields } : {}),
    };

    response.status(status).json(payload);
  }
}
