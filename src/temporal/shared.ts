export const TASK_QUEUE = 'railway-queue';

export interface RzhdResponse {
  wagonNumber: string;
  status: string;
  station: string;
  time: string;
}

export const ACTIVITY_FETCH_DATA = 'fetchDataFromRzhd';
export const ACTIVITY_SAVE_EVENT = 'saveTrackingEvent';
