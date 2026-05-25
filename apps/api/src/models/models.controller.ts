import { Controller, Get, Post } from '@nestjs/common';
import { ModelProberService } from './model-prober.service';
import { EventsService } from '../events/events.service';

@Controller('models')
export class ModelsController {
  constructor(
    private readonly prober: ModelProberService,
    private readonly events: EventsService,
  ) {}

  @Get()
  getRegistry() {
    return this.prober.getRegistry();
  }

  @Post('refresh')
  async refresh() {
    const registry = await this.prober.refresh();
    this.events.emitAppEvent({ type: 'models:updated', registry });
    return registry;
  }
}
