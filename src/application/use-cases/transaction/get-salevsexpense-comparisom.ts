import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/application/repositories/transaction-repository';

interface GetSalesVsExpensesComparisonRequest {
  startDate?: Date;
  endDate?: Date;
  deliverymanId?: string;
}

export interface GetSalesVsExpensesComparisonResponse {
  totalSales: { year: number; month: number; total: number }[];
  totalExpenses: { year: number; month: number; total: number }[];
}

@Injectable()
export class GetSalesVsExpensesComparisonUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    startDate,
    endDate,
    deliverymanId,
  }: GetSalesVsExpensesComparisonRequest): Promise<GetSalesVsExpensesComparisonResponse> {
    const salesVsExpenses =
      await this.transactionRepository.getSalesVsExpensesComparison(
        startDate,
        endDate,
        deliverymanId,
      );

    return {
      totalSales: salesVsExpenses.totalSales,
      totalExpenses: salesVsExpenses.totalExpenses,
    };
  }
}
