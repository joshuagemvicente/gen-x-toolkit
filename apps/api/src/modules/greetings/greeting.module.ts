import { Module } from "@nestjs/common";
import { GREETING_REPOSITORY } from "./application/greeting.repository.port";
import type { GreetingRepository } from "./application/greeting.repository.port";
import { GreetingService } from "./application/greeting.service";
import { InMemoryGreetingRepository } from "./infrastructure/in-memory-greeting.repository";
import { GreetingController } from "./transport/greeting.controller";

/**
 * Composition root of the greetings feature: the only place that knows which
 * adapter backs the application's port, and the only place that constructs the
 * use cases — that is what keeps the application layer free of framework
 * imports.
 *
 * Swapping the storage means changing this file and nothing else.
 */
@Module({
  controllers: [GreetingController],
  providers: [
    { provide: GREETING_REPOSITORY, useClass: InMemoryGreetingRepository },
    {
      provide: GreetingService,
      useFactory: (repository: GreetingRepository) =>
        new GreetingService(repository),
      inject: [GREETING_REPOSITORY],
    },
  ],
})
export class GreetingModule {}
