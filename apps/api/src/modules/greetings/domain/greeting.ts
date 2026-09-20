/** How many greetings the service retains. */
export const GREETING_HISTORY_LIMIT = 50;

/** A greeting that was recorded for someone. */
export interface Greeting {
  readonly name: string;
  readonly message: string;
  readonly greetedAt: Date;
}

/** Raised when an operation would break a rule of the domain. */
export class GreetingInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GreetingInvariantError";
  }
}

/**
 * Builds a greeting, normalising the name and enforcing the invariant that a
 * greeting always addresses someone.
 *
 * The invariant lives with the data it protects, so no caller can create an
 * invalid greeting — regardless of which transport or storage is used.
 */
export function createGreeting(
  name: string,
  greetedAt: Date = new Date(),
): Greeting {
  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    throw new GreetingInvariantError("A greeting needs a non-empty name.");
  }

  return {
    name: normalizedName,
    message: `Hello, ${normalizedName}!`,
    greetedAt,
  };
}
