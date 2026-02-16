import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, Connection } from '@temporalio/client';
import { Worker, NativeConnection } from '@temporalio/worker';
import { PrismaService } from '../prisma/prisma.service';
import { ClickHouseService } from '../analytics/clickhouse.service';
import { createActivities } from './activities';
import { TASK_QUEUE } from './shared';

@Injectable()
export class TemporalService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private worker: Worker;

  constructor(
    private readonly prisma: PrismaService,
    private readonly clickhouse: ClickHouseService,
  ) {}

  async onModuleInit() {
    const connection = await Connection.connect();
    this.client = new Client({ connection });

    const workerConnection = await NativeConnection.connect({
      address: 'localhost:7233',
    });

    this.worker = await Worker.create({
      connection: workerConnection,
      workflowsPath: require.resolve('./workflows'),
      // Передаем оба сервиса в Activities
      activities: createActivities(this.prisma, this.clickhouse),
      taskQueue: TASK_QUEUE,
    });

    this.worker.run();
    console.log('✅ Temporal Worker started');
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.shutdown();
    }
    if (this.client) {
      await this.client.connection.close();
    }
  }

  async startSync(wagonNumber: string) {
    const handle = await this.client.workflow.start('syncWagonWorkflow', {
      taskQueue: TASK_QUEUE,
      args: [wagonNumber],
      workflowId: `sync-${wagonNumber}-${Date.now()}`,
    });
    return handle.workflowId;
  }
}
