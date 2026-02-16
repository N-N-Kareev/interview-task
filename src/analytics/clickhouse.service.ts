import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, ClickHouseClient } from '@clickhouse/client';

@Injectable()
export class ClickHouseService implements OnModuleInit {
  private client: ClickHouseClient;

  constructor() {
    this.client = createClient({
      url: 'http://localhost:8123',
      username: 'default',
      password: 'root',
      database: 'default',
    });
  }

  async onModuleInit() {
    await this.client.command({
      query: `
        CREATE TABLE IF NOT EXISTS tracking_events (
          id String,
          wagon_id String,
          event_type String,
          location String,
          event_time DateTime
        ) ENGINE = MergeTree()
        ORDER BY (wagon_id, event_time)
      `,
    });
    console.log('✅ ClickHouse table initialized');
  }

  async insertEvent(data: any) {
    await this.client.insert({
      table: 'tracking_events',
      values: [
        {
          id: String(Date.now()),
          wagon_id: data.wagonNumber,
          event_type: data.status,
          location: data.station,
          event_time: Math.floor(new Date(data.time).getTime() / 1000), // Unix timestamp
        },
      ],
      format: 'JSONEachRow',
    });
  }

  async getStats() {
    const result = await this.client.query({
      query: `
        SELECT 
          event_type, 
          count() as total
        FROM tracking_events
        GROUP BY event_type
      `,
      format: 'JSONEachRow',
    });
    return result.json();
  }
}
