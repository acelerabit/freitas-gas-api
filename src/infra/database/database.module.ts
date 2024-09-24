import { NotificationRepository } from '@/application/repositories/notification-repository';
import { Module } from '@nestjs/common';
import { LogsRepository } from 'src/application/repositories/logs-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { CustomersRepository } from 'src/application/repositories/customer-repository';
import { DateService } from '../dates/date.service';
import { prismaExtensionFactory } from './prisma/prisma-extension';
import { PrismaService } from './prisma/prisma.service';
import { PrismaLogsRepository } from './prisma/repositories/prisma-logs-repository';
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository';
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customers-repository';

@Module({
  providers: [
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: LogsRepository,
      useClass: PrismaLogsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
    {
      provide: PrismaService,
      useFactory: () => {
        return prismaExtensionFactory(new PrismaService());
      },
    },
    DateService,
  ],
  exports: [
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: LogsRepository,
      useClass: PrismaLogsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
    {
      provide: PrismaService,
      useFactory: () => {
        return prismaExtensionFactory(new PrismaService());
      },
    },
  ],
})
export class DatabaseModule {}
