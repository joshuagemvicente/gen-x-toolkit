import { z } from "zod";

/**
 * Environment variables this service understands, validated once at boot.
 *
 * Parsing lives here and nowhere else: every other module receives the
 * resulting `AppConfig` through dependency injection instead of reading
 * `process.env` directly, so a missing or malformed variable fails the process
 * at startup rather than on the first request that happens to need it.
 */
const AppConfigSchema = z.object({
  serviceName: z.string().min(1).default("api"),
  version: z.string().min(1).default("0.0.0"),
  port: z.coerce.number().int().min(0).max(65535).default(4000),
  corsOrigins: z
    .string()
    .default("http://localhost:3000")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0),
    )
    .refine((origins) => origins.length > 0, {
      message: "must list at least one origin",
    }),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

/** Injection token for the validated configuration. */
export const APP_CONFIG = Symbol("APP_CONFIG");

/** Parses and validates the configuration, throwing if it is unusable. */
export function loadAppConfig(env: NodeJS.ProcessEnv): AppConfig {
  const parsed = AppConfigSchema.safeParse({
    serviceName: env.SERVICE_NAME,
    version: env.APP_VERSION,
    port: env.PORT,
    corsOrigins: env.CORS_ORIGINS,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")} ${issue.message}`)
        .join("; ")}`,
    );
  }

  return parsed.data;
}
