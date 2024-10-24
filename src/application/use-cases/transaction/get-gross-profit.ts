import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/application/repositories/transaction-repository';

@Injectable()
export class CalculateGrossProfit {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<number> {
    const grossProfit = await this.transactionRepository.getGrossProfit(
      startDate,
      endDate,
      deliverymanId,
    );
    return grossProfit;
  }
}
