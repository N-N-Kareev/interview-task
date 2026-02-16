import { Module } from '@nestjs/common';
import { TemporalService } from './temporal.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule],
  providers: [TemporalService],
  exports: [TemporalService],
})
export class TemporalModule {}
