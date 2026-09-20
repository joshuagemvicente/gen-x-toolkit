import { createGreeting, GREETING_HISTORY_LIMIT } from "../domain/greeting";
import { InMemoryGreetingRepository } from "./in-memory-greeting.repository";

describe("InMemoryGreetingRepository", () => {
  it("returns the most recently saved greeting first", async () => {
    const repository = new InMemoryGreetingRepository();

    await repository.save(createGreeting("Ada"));
    await repository.save(createGreeting("Grace"));

    const recent = await repository.findRecent(10);

    expect(recent.map((greeting) => greeting.name)).toEqual(["Grace", "Ada"]);
  });

  it(`retains only the ${GREETING_HISTORY_LIMIT} most recent greetings`, async () => {
    const repository = new InMemoryGreetingRepository();
    const overflow = 5;

    for (
      let index = 0;
      index < GREETING_HISTORY_LIMIT + overflow;
      index += 1
    ) {
      await repository.save(createGreeting(`guest-${index}`));
    }

    expect(await repository.count()).toBe(GREETING_HISTORY_LIMIT);
    expect((await repository.findRecent(GREETING_HISTORY_LIMIT))[0]?.name).toBe(
      `guest-${GREETING_HISTORY_LIMIT + overflow - 1}`,
    );
  });

  it("honours the requested limit and a limit of zero", async () => {
    const repository = new InMemoryGreetingRepository();

    await repository.save(createGreeting("Ada"));
    await repository.save(createGreeting("Grace"));

    expect(await repository.findRecent(1)).toHaveLength(1);
    expect(await repository.findRecent(0)).toHaveLength(0);
  });
});
