import { Logger } from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";
import { APP_CONFIG, type AppConfig } from "./config/app-config";

/**
 * Cross-cutting HTTP wiring, kept out of `main.ts` so the e2e tests can apply
 * the exact same filters and CORS policy the running process uses — the tests
 * exercise production behaviour, not a simplified equivalent.
 */
export function configureApp(app: INestApplication): void {
  const config = app.get<AppConfig>(APP_CONFIG);

  app.enableCors({ origin: config.corsOrigins });
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableShutdownHooks();

  Logger.log(
    `cors origins: ${config.corsOrigins.join(", ")}`,
    configureApp.name,
  );
}
