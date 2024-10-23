import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import { TransactionRepository } from '@/application/repositories/transaction-repository';

interface GetTotalExpensesDeliverymanTodayRequest {
  deliverymanId: string;
}

@Injectable()
export class GetTotalExpensesDeliverymanToday {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({
    deliverymanId,
  }: GetTotalExpensesDeliverymanTodayRequest): Promise<number> {
    return this.transactionRepository.getTotalExpensesByDeliveryman(
      deliverymanId,
    );
  }
}
