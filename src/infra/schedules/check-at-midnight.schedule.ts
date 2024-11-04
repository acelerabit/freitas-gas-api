import { UsersRepository } from '@/application/repositories/user-repository';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateService } from '../dates/date.service';
import { SalesRepository } from '@/application/repositories/sales-repository';
import { TransactionRepository } from '@/application/repositories/transaction-repository';
import { fCurrencyIntlBRL } from '@/utils/formatCurrency';
import { WebsocketsGateway } from '../websocket/websocket.service';
import { formatDateWithHours } from '@/utils/formatDateToFront';

@Injectable()
export class CheckAtMidnight {
  constructor(
    private usersRepository: UsersRepository,
    private dateService: DateService,
    private salesRepository: SalesRepository,
    private transactionsRepository: TransactionRepository,
    private websocketService: WebsocketsGateway,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    const deliverymans = await this.usersRepository.getDeliverymans();

    const yesterday = this.dateService.yesterday();

    await Promise.all(
      deliverymans.map(async (deliveryman) => {
        const revenuesInMoneyYesterday =
          await this.salesRepository.getTotalMoneySalesByDeliverymanYesterday(
            deliveryman.id,
          );
        const depositsByDeliverymanYesterday =
          await this.transactionsRepository.findAllDepositsByDeliverymanYesterday(
            deliveryman.id,
          );

        if (
          revenuesInMoneyYesterday > 0 &&
          depositsByDeliverymanYesterday.length <= 0
        ) {
          const message = `O entregador ${
            deliveryman.email
          } deveria ter informado um depósito no dia ${formatDateWithHours(
            yesterday,
          )} no entanto não o fez, o saldo de vendas em dinheiro em sua conta era de ${fCurrencyIntlBRL(
            revenuesInMoneyYesterday / 100,
          )}`;

          const admins = await this.usersRepository.getAdmins();

          const notifications = admins.map(async (admin) => {
            await this.websocketService.sendNotification(admin.id, message);
          });

          // Aguardando todas as promessas
          await Promise.all(notifications);
        }
      }),
    );
  }
}
