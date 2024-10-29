// schedule.module.ts

import { Module } from '@nestjs/common';
import { ScheduleService } from './schedules.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CheckAtMidnight } from './check-at-midnight.schedule';
import { DatabaseModule } from '../database/database.module';
import { DateModule } from '../dates/date.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { WebsocketsGateway } from '../websocket/websocket.service';
import { PrismaService } from '../database/prisma/prisma.service';

@Module({
  providers: [ScheduleService, CheckAtMidnight, WebsocketsGateway, PrismaService],
  exports: [ScheduleService],
  imports: [ScheduleModule.forRoot(), DatabaseModule, DateModule],
})
export class SchedulesModule {}
