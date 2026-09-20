import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { GreetingModule } from "./modules/greetings/greeting.module";
import { HealthModule } from "./modules/health/health.module";

/**
 * Composition root: the only place that lists the feature modules of the
 * service. Feature wiring lives in each module, never here.
 */
@Module({
  imports: [ConfigModule, HealthModule, GreetingModule],
})
export class AppModule {}
