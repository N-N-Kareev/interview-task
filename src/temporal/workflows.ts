// src/temporal/workflows.ts
import { proxyActivities } from '@temporalio/workflow';
import type { createActivities } from './activities'; // Только тип!
import { RzhdResponse } from './shared';

const { fetchDataFromRzhd, saveTrackingEvent } = proxyActivities<
  ReturnType<typeof createActivities>
>({
  startToCloseTimeout: '10 seconds',
  retry: {
    initialInterval: '1 second',
    maximumAttempts: 5,
  },
});

export async function syncWagonWorkflow(wagonNumber: string): Promise<string> {
  const data: RzhdResponse = await fetchDataFromRzhd(wagonNumber);

  await saveTrackingEvent(data);

  return `Вагон ${wagonNumber} успешно синхронизирован! Статус: ${data.status}`;
}
