// src/temporal/activities.ts
import { PrismaService } from '../prisma/prisma.service';
import { RzhdResponse } from './shared';

// Фабрика активностей принимает PrismaService
export const createActivities = (prisma: PrismaService) => ({

  // 1. Имитация тяжелого запроса в РЖД
  async fetchDataFromRzhd(wagonNumber: string): Promise<RzhdResponse> {
    console.log(`[Activity] Запрос в РЖД по вагону ${wagonNumber}...`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    console.log(`[Activity] Сохраняем событие в БД...`);

    const wagon = await prisma.wagon.upsert({
      where: { serialNumber: data.wagonNumber },
      update: {},
      create: { serialNumber: data.wagonNumber, type: 'UNKNOWN' },
    });

    return prisma.trackingEvent.create({
      data: {
        eventType: data.status,
        location: data.station,
        eventTime: data.time,
        wagonId: wagon.id,
      },
    });
  },
});