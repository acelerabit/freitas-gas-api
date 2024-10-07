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
  description?: string;
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
    description,
  }: CreateTransactionRequest): Promise<void> {
    const amountFormatted = amount * 100;

    const transaction = Transaction.create({
      amount: amountFormatted,
      category,
      transactionType,
      userId,
      customCategory,
      description,
    });

    await this.transactionRepository.createTransaction(transaction);
  }
}
