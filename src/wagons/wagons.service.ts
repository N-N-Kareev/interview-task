import { Injectable } from '@nestjs/common';
import { CreateWagonDto } from './dto/create-wagon.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WagonsService {
  constructor(private prisma: PrismaService) {}

  create(createWagonDto: CreateWagonDto) {
    return this.prisma.wagon.create({
      data: createWagonDto,
    });
  }

  findAll() {
    return this.prisma.wagon.findMany({
      include: { events: true },
    });
  }

  findOne(id: number) {
    return this.prisma.wagon.findUnique({
      where: { id },
      include: { events: true },
    });
  }

  async getMetrics() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const metrics = await (this.prisma as any).$metrics.json();
    return metrics;
  }
}
