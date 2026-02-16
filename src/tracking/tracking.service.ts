import { Injectable } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  create(createTrackingDto: CreateTrackingDto) {
    return this.prisma.trackingEvent.create({
      data: {
        eventType: createTrackingDto.eventType,
        location: createTrackingDto.location,
        eventTime: new Date(createTrackingDto.eventTime),
        wagon: {
          connect: { serialNumber: createTrackingDto.wagonSerialNumber },
        },
      },
    });
  }

  findAll() {
    return this.prisma.trackingEvent.findMany({
      include: { wagon: true },
      orderBy: { eventTime: 'desc' },
    });
  }
}
