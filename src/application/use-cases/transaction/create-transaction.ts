import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { Transaction } from '../../entities/transaction';
import { TransactionCategory, TransactionType } from '@prisma/client';

interface CreateTransactionRequest {
  transactionType: TransactionType;
  category: TransactionCategory;
  userId: string;
  customCategory?: string;
  amount: number;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({
    amount,
    category,
    transactionType,
    userId,
    customCategory,
  }: CreateTransactionRequest): Promise<void> {
    const amountFormatted = amount * 100;

    const transaction = Transaction.create({
      amount: amountFormatted,
      category,
      transactionType,
      userId,
      customCategory,
    });

    await this.transactionRepository.createTransaction(transaction);
  }
}
