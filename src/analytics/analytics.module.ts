import { Module } from '@nestjs/common';
import { ClickHouseService } from './clickhouse.service';
import { AnalyticsController } from './analytics.controller';


@Module({
  providers: [ClickHouseService],
  controllers: [AnalyticsController],
  exports: [ClickHouseService],
})
export class AnalyticsModule {}
