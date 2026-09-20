import { Controller, Get, Query } from "@nestjs/common";
import { GreetingRequestSchema } from "@repo/contracts";
import type {
  Greeting as GreetingPayload,
  GreetingListResponse,
  GreetingRequest,
} from "@repo/contracts";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { GreetingService } from "../application/greeting.service";
import { toGreetingPayload } from "./greeting.mapper";

/**
 * Transport layer: turns HTTP into use case calls and back. No rules live here
 * — the contract validates the input, the domain builds the greeting.
 */
@Controller("greetings")
export class GreetingController {
  constructor(private readonly greetings: GreetingService) {}

  @Get()
  async greet(
    @Query(new ZodValidationPipe(GreetingRequestSchema)) request: GreetingRequest,
  ): Promise<GreetingPayload> {
    return toGreetingPayload(await this.greetings.greet(request.name));
  }

  @Get("recent")
  async listRecent(): Promise<GreetingListResponse> {
    const { items, total } = await this.greetings.listRecent();

    return { items: items.map(toGreetingPayload), total };
  }
}
