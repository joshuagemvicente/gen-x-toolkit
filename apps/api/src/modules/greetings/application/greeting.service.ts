import {
  createGreeting,
  GREETING_HISTORY_LIMIT,
  type Greeting,
} from "../domain/greeting";
import type { GreetingRepository } from "./greeting.repository.port";

/** Result of reading the greeting history. */
export interface GreetingHistory {
  readonly items: readonly Greeting[];
  readonly total: number;
}

/**
 * Use cases of the greetings feature.
 *
 * Framework-free on purpose: the port arrives through the constructor and the
 * module constructs the service (see `greeting.module.ts`). ESLint rejects any
 * Nest import in this layer, so the use cases stay testable without a Nest
 * container and cannot quietly grow HTTP or wiring concerns.
 */
export class GreetingService {
  constructor(private readonly repository: GreetingRepository) {}

  /** Records a greeting for `name` and returns it. */
  async greet(name: string): Promise<Greeting> {
    const greeting = createGreeting(name);

    await this.repository.save(greeting);

    return greeting;
  }

  /** The most recent greetings, newest first, plus the total recorded. */
  async listRecent(
    limit: number = GREETING_HISTORY_LIMIT,
  ): Promise<GreetingHistory> {
    const [items, total] = await Promise.all([
      this.repository.findRecent(limit),
      this.repository.count(),
    ]);

    return { items, total };
  }
}
