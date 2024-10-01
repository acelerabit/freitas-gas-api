import { TransactionRepository } from '../../../../application/repositories/transaction-repository';
import { Transaction } from '../../../../application/entities/transaction';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTransactionRepository extends TransactionRepository {
  constructor(private prismaService: PrismaService) {
    super();
  }

  async createTransaction(transaction: Transaction): Promise<void> {
    const transactionData = {
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      mainAccount: transaction.mainAccount ?? false,
      category: transaction.category,
      userId: transaction.userId,
      referenceId: transaction.referenceId ?? null,
      createdAt: new Date(),
      customCategory: transaction.customCategory ?? null,
    };

    await this.prismaService.transaction.create({
      data: transactionData,
    });
  }
}
