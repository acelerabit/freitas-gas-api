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
import { SalesRepository } from '@/application/repositories/sales-repository';
import { PrismaSalesRepository } from './prisma/repositories/prisma-sales-repository';
import { TransactionRepository } from '@/application/repositories/transaction-repository';
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository';
import { ProductRepository } from '@/application/repositories/product-repository';
import { PrismaProductRepository } from './prisma/repositories/prisma-products-repository';
import { ExpenseTypesRepository } from '@/application/repositories/expense-type-repository';
import { PrismaExpenseTypesRepository } from './prisma/repositories/prisma-expense-type-repository';

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
      provide: SalesRepository,
      useClass: PrismaSalesRepository,
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: ExpenseTypesRepository,
      useClass: PrismaExpenseTypesRepository,
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
      provide: SalesRepository,
      useClass: PrismaSalesRepository,
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: ExpenseTypesRepository,
      useClass: PrismaExpenseTypesRepository,
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
