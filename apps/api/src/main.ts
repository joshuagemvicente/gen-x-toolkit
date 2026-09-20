import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./bootstrap";
import { APP_CONFIG, type AppConfig } from "./config/app-config";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const config = app.get<AppConfig>(APP_CONFIG);
  await app.listen(config.port);

  Logger.log(`api listening on http://localhost:${config.port}`, "Bootstrap");
}

bootstrap().catch((error: unknown) => {
  Logger.error(
    error instanceof Error ? error.message : String(error),
    undefined,
    "Bootstrap",
  );
  process.exitCode = 1;
});
