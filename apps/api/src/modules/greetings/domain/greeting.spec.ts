import { createGreeting, GreetingInvariantError } from "./greeting";

describe("createGreeting", () => {
  it("addresses the name it was given and normalises surrounding whitespace", () => {
    const greetedAt = new Date("2026-01-02T03:04:05.000Z");

    expect(createGreeting("  Ada  ", greetedAt)).toEqual({
      name: "Ada",
      message: "Hello, Ada!",
      greetedAt,
    });
  });

  it("refuses a name that carries no content", () => {
    expect(() => createGreeting("   ")).toThrow(GreetingInvariantError);
  });
});
