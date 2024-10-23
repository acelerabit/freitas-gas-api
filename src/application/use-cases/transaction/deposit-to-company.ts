import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { Transaction } from '../../entities/transaction';
import { TransactionCategory, TransactionType } from '@prisma/client';
import { ExpenseType } from '@/application/entities/expense-type';
import { ExpenseTypesRepository } from '@/application/repositories/expense-type-repository';
import { SalesRepository } from '@/application/repositories/sales-repository';

interface DepositToCompanyRequest {
  transactionType: TransactionType;
  category: TransactionCategory;
  deliverymanId: string;
  amount: number;
  depositDate: Date;
  bank: string;
}

@Injectable()
export class DepositToCompanyUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private saleRepository: SalesRepository,
  ) {}

  async execute({
    amount,
    category,
    transactionType,
    deliverymanId,
    depositDate,
    bank,
  }: DepositToCompanyRequest): Promise<void> {
    const amountFormatted = amount * 100;

    const revenuesToday =
      await this.saleRepository.getTotalRevenuesByDeliveryman(deliverymanId);

    if (amountFormatted !== revenuesToday) {
      console.log({ revenuesToday, amountFormatted, message: 'não é igual' });
    }

    const transaction = Transaction.create({
      amount: amountFormatted,
      category,
      transactionType,
      userId: deliverymanId,
      depositDate,
      bank,
    });

    await this.transactionRepository.createTransaction(transaction);
  }
}
