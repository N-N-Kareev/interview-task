import { Controller, Get } from '@nestjs/common';
import { ClickHouseService } from './clickhouse.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly clickhouseService: ClickHouseService) {}

  @Get('stats')
  async getStats() {
    return this.clickhouseService.getStats();
  }
}
