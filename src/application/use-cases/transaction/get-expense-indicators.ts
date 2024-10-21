import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/application/repositories/transaction-repository';

@Injectable()
export class GetExpenseIndicators {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<{
    totalExpenses: number;
    totalPerDay: { createdAt: Date; total: number }[];
    totalPerMonth: { year: number; month: number; total: number }[];
  }> {
    return this.transactionRepository.getExpenseIndicators(
      startDate,
      endDate,
      deliverymanId,
    );
  }
}
