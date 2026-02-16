import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WagonsService } from './wagons.service';
import { CreateWagonDto } from './dto/create-wagon.dto';
import { TemporalService } from '../temporal/temporal.service';

@Controller('wagons')
export class WagonsController {
  constructor(
    private readonly wagonsService: WagonsService,
    private readonly temporalService: TemporalService,
  ) {}

  @Post()
  create(@Body() createWagonDto: CreateWagonDto) {
    return this.wagonsService.create(createWagonDto);
  }

  @Get()
  findAll() {
    return this.wagonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wagonsService.findOne(+id);
  }

  @Post(':serial/sync')
  async syncWagon(@Param('serial') serial: string) {
    const workflowId = await this.temporalService.startSync(serial);
    return {
      message: 'Sync started',
      workflowId,
    };
  }

  @Get('metrics')
  async getDbMetrics() {
    return this.wagonsService.getMetrics();
  }
}
