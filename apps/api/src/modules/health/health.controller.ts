import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@repo/contracts";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.health.check();
  }
}
