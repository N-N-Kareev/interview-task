import { Module } from '@nestjs/common';
import { WagonsService } from './wagons.service';
import { WagonsController } from './wagons.controller';
import { TemporalModule } from '../temporal/temporal.module';

@Module({
  imports: [TemporalModule],
  controllers: [WagonsController],
  providers: [WagonsService],
})
export class WagonsModule {}
