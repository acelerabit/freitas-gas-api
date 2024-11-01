import { SalesRepository } from '@/application/repositories/sales-repository';
import { UsersRepository } from '@/application/repositories/user-repository';
import { WebsocketsGateway } from '@/infra/websocket/websocket.service';
import { fCurrencyIntlBRL } from '@/utils/formatCurrency';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionCategory, TransactionType } from '@prisma/client';
import { Transaction } from '../../entities/transaction';
import { TransactionRepository } from '../../repositories/transaction-repository';

interface DepositToCompanyRequest {
  transactionType: TransactionType;
  category: TransactionCategory;
  deliverymanId: string;
  amount: number;
  depositDate: Date;
  bank?: string;
}

@Injectable()
export class DepositToCompanyUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private saleRepository: SalesRepository,
    private usersRepository: UsersRepository,
    private websocketService: WebsocketsGateway,
  ) {}

  async execute({
    amount,
    category,
    transactionType,
    deliverymanId,
    depositDate,
    bank,
  }: DepositToCompanyRequest): Promise<void> {
    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (!deliveryman) {
      throw new BadRequestException('Entregador não encontrado', {
        cause: new Error('Entregador não encontrado'),
        description: 'Entregador não encontrado',
      });
    }

    const amountFormatted = amount * 100;

    const revenuesTodayMoney =
      await this.saleRepository.getTotalMoneySalesByDeliveryman(deliverymanId);

    // se o amount for menor do que o saldo da data de hoje
    if (amountFormatted !== revenuesTodayMoney) {
      const message = `O entregador ${
        deliveryman.email
      } informou um depósito de ${fCurrencyIntlBRL(
        amountFormatted / 100,
      )} mas o total de receita em dinheiro recebido no dia de hoje foi ${fCurrencyIntlBRL(
        revenuesTodayMoney / 100,
      )}`;

      const admins = await this.usersRepository.getAdmins();

      const notifications = admins.map(async (admin) => {
        await this.websocketService.sendNotification(admin.id, message);
      });

      // Aguardando todas as promessas
      await Promise.all(notifications);
    }

    const transaction = Transaction.create({
      amount: amountFormatted,
      category,
      transactionType,
      userId: deliverymanId,
      depositDate,
      bank,
    });

    // zerar saldo do entregador

    deliveryman.accountAmount = 0;

    await this.usersRepository.update(deliveryman);

    await this.transactionRepository.createTransaction(transaction);
  }
}
