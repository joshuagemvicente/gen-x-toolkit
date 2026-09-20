import { Global, Module } from "@nestjs/common";
import { APP_CONFIG, loadAppConfig } from "./app-config";

/**
 * Makes the validated configuration injectable everywhere.
 *
 * The factory runs while the module graph is built, so an invalid environment
 * stops the process before it accepts traffic.
 */
@Global()
@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: () => loadAppConfig(process.env),
    },
  ],
  exports: [APP_CONFIG],
})
export class ConfigModule {}
