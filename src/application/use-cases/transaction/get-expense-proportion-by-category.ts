import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/application/repositories/transaction-repository';

@Injectable()
export class GetExpenseProportionByCategoryUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<{ category: string; percentage: number }[]> {
    const expenseProportions =
      await this.transactionRepository.getExpenseProportionByCustomCategory(
        startDate,
        endDate,
        deliverymanId,
      );
    return expenseProportions;
  }
}

