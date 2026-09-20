import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";
import {
  ApiValidationErrorResponseSchema,
  GreetingListResponseSchema,
  GreetingSchema,
  HealthResponseSchema,
} from "@repo/contracts";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/bootstrap";

/**
 * Exercises the service over HTTP and parses every response with the schema
 * from `@repo/contracts`. If the API and the web app's contract ever drift,
 * these tests fail — the contract is the assertion.
 */
describe("api (e2e)", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("reports health in the contracted shape", async () => {
    const response = await request(app.getHttpServer()).get("/health").expect(200);

    expect(HealthResponseSchema.parse(response.body)).toMatchObject({
      status: "ok",
      service: "api",
    });
  });

  it("greets the requested name", async () => {
    const response = await request(app.getHttpServer())
      .get("/greetings")
      .query({ name: "Ada" })
      .expect(200);

    expect(GreetingSchema.parse(response.body).message).toBe("Hello, Ada!");
  });

  it("lists the newest greeting first and counts the ones it kept", async () => {
    await request(app.getHttpServer())
      .get("/greetings")
      .query({ name: "Grace" })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get("/greetings/recent")
      .expect(200);
    const { items, total } = GreetingListResponseSchema.parse(response.body);

    expect(items[0]?.message).toBe("Hello, Grace!");
    expect(total).toBe(items.length);
  });

  it("rejects a blank name with the error envelope and per-field details", async () => {
    const response = await request(app.getHttpServer())
      .get("/greetings")
      .query({ name: "   " })
      .expect(400);

    const error = ApiValidationErrorResponseSchema.parse(response.body);

    expect(error.fields[0]?.path).toBe("name");
  });
});
