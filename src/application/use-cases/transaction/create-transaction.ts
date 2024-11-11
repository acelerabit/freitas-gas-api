import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { Transaction } from '../../entities/transaction';
import { TransactionCategory, TransactionType } from '@prisma/client';
import { ExpenseType } from '@/application/entities/expense-type';
import { ExpenseTypesRepository } from '@/application/repositories/expense-type-repository';
import { IncomeType } from '@/application/entities/income-types';
import { IncomeTypesRepository } from '@/application/repositories/income-types-repository';

interface CreateTransactionRequest {
  transactionType: TransactionType;
  category: TransactionCategory;
  userId: string;
  customCategory?: string;
  amount: number;
  description?: string;
  bankAccountId?: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly expenseTypeRepository: ExpenseTypesRepository,
    private readonly incomeTypeRepository: IncomeTypesRepository,
  ) {}

  async execute({
    amount,
    category,
    transactionType,
    userId,
    customCategory,
    description,
    bankAccountId
  }: CreateTransactionRequest): Promise<void> {
    const amountFormatted = amount * 100;

    const transaction = Transaction.create({
      amount: amountFormatted,
      category,
      transactionType,
      userId,
      customCategory,
      description,
      bankAccountId
    });

    if (category === 'INCOME') {
      const incomeType = IncomeType.create({
        name: customCategory,
      });

      await this.incomeTypeRepository.create(incomeType);
    } else {
      const expenseType = ExpenseType.create({
        name: customCategory,
      });

      await this.expenseTypeRepository.create(expenseType);
    }

    await this.transactionRepository.createTransaction(transaction);
  }
}
