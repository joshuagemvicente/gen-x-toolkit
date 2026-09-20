import { Injectable } from "@nestjs/common";
import { GREETING_HISTORY_LIMIT, type Greeting } from "../domain/greeting";
import type { GreetingRepository } from "../application/greeting.repository.port";

/**
 * Adapter that keeps greetings in process memory.
 *
 * It exists so the reference feature runs without infrastructure. Swap it in
 * `greeting.module.ts` for a database-backed adapter — nothing else changes.
 */
@Injectable()
export class InMemoryGreetingRepository implements GreetingRepository {
  private readonly greetings: Greeting[] = [];

  async save(greeting: Greeting): Promise<void> {
    this.greetings.unshift(greeting);
    this.greetings.length = Math.min(
      this.greetings.length,
      GREETING_HISTORY_LIMIT,
    );
  }

  async findRecent(limit: number): Promise<readonly Greeting[]> {
    return this.greetings.slice(0, Math.max(0, limit));
  }

  async count(): Promise<number> {
    return this.greetings.length;
  }
}
