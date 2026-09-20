import type { Greeting as GreetingPayload } from "@repo/contracts";
import type { Greeting } from "../domain/greeting";

/**
 * Maps the domain model onto the wire contract.
 *
 * The domain keeps a `Date`; the contract carries an ISO string. The mapping
 * is explicit so a change on either side fails to compile instead of silently
 * shipping the wrong shape.
 */
export function toGreetingPayload(greeting: Greeting): GreetingPayload {
  return {
    message: greeting.message,
    greetedAt: greeting.greetedAt.toISOString(),
  };
}
