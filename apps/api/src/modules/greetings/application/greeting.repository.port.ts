import type { Greeting } from "../domain/greeting";

/** Injection token for the greeting store. */
export const GREETING_REPOSITORY = Symbol("GREETING_REPOSITORY");

/**
 * What the application layer needs from storage, and nothing more.
 *
 * Adapters that implement this port live in `infrastructure` and are bound in
 * `greeting.module.ts`. The application code never names a concrete store, so
 * replacing the in-memory adapter with a database changes one line of wiring.
 */
export interface GreetingRepository {
  save(greeting: Greeting): Promise<void>;
  findRecent(limit: number): Promise<readonly Greeting[]>;
  count(): Promise<number>;
}
