import { PrismaService } from '../prisma/prisma.service';
import { ClickHouseService } from '../analytics/clickhouse.service';
import { RzhdResponse } from './shared';

export const createActivities = (
  prisma: PrismaService,
  clickhouse: ClickHouseService,
) => ({
  async fetchDataFromRzhd(wagonNumber: string): Promise<RzhdResponse> {
    console.log(`[Activity] Запрос в РЖД по вагону ${wagonNumber}...`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (Math.random() < 0.2) {
      throw new Error('РЖД API недоступно (503 Service Unavailable)');
    }
    return {
      wagonNumber,
      status: Math.random() > 0.5 ? 'ARRIVAL' : 'DEPARTURE',
      station: 'Москва-Сортировочная',
      time: new Date().toISOString(),
    };
  },

  async saveTrackingEvent(data: RzhdResponse) {
    console.log(`[Activity] Сохраняем событие (Hybrid: PG + ClickHouse)...`);

    const wagon = await prisma.wagon.upsert({
      where: { serialNumber: data.wagonNumber },
      update: { updatedAt: new Date() },
      create: { serialNumber: data.wagonNumber, type: 'UNKNOWN' },
    });

    const pgEvent = await prisma.trackingEvent.create({
      data: {
        eventType: data.status,
        location: data.station,
        eventTime: data.time,
        wagonId: wagon.id,
      },
    });
    try {
      await clickhouse.insertEvent(data);
    } catch (e) {
      console.error(
        '[Warning] Ошибка записи в ClickHouse (Workflow продолжится):',
        e,
      );
    }

    return pgEvent;
  },
});
