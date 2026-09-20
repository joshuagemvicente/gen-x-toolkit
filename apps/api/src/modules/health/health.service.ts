import { Inject, Injectable } from "@nestjs/common";
import type { HealthResponse } from "@repo/contracts";
import { APP_CONFIG, type AppConfig } from "../../config/app-config";

/** Reports liveness and identity of the running process. */
@Injectable()
export class HealthService {
  private readonly startedAt = Date.now();

  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  check(): HealthResponse {
    return {
      status: "ok",
      service: this.config.serviceName,
      version: this.config.version,
      uptimeSeconds: Math.max(0, Math.round((Date.now() - this.startedAt) / 1000)),
      timestamp: new Date().toISOString(),
    };
  }
}
