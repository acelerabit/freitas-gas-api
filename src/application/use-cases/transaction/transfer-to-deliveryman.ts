import { Transaction } from '@/application/entities/transaction';
import { UsersRepository } from '@/application/repositories/user-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionCategory, TransactionType } from '@prisma/client';
import { TransactionRepository } from 'src/application/repositories/transaction-repository';

interface TransferToDeliverymanRequest {
  deliverymanId: string;
  transactionType: TransactionType;
  customCategory: string;
  category: TransactionCategory;
  amount: number;
  description?: string;
  bankAccountId?: string;
  senderUserId: string;
}

@Injectable()
export class TransferToDeliveryman {
  constructor(
    private transactionsRepository: TransactionRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    deliverymanId,
    amount,
    transactionType,
    category,
    customCategory,
    description,
    bankAccountId,
    senderUserId,
  }: TransferToDeliverymanRequest) {
    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (deliveryman.role !== 'DELIVERYMAN') {
      throw new BadRequestException('Entregador não encontrado', {
        cause: new Error('Entregador não encontrado'),
        description: 'Entregador não encontrado',
      });
    }

    if (!deliveryman) {
      throw new BadRequestException('Entregador não encontrado', {
        cause: new Error('Entregador não encontrado'),
        description: 'Entregador não encontrado',
      });
    }

    const transaction = Transaction.create({
      amount: amount * 100,
      category,
      transactionType,
      userId: deliverymanId,
      customCategory,
      description,
      bankAccountId,
      senderUserId,
    });

    await this.transactionsRepository.createTransaction(transaction);

    deliveryman.accountAmount = amount * 100;

    await this.usersRepository.update(deliveryman);
  }
}
