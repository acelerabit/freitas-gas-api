import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import { TransactionRepository } from '@/application/repositories/transaction-repository';

interface FetchExpensesByDeliverymanRequest {
  deliverymanId: string;
  pagination: PaginationParams;
}

interface FetchExpensesByDeliverymanResponse {
  transactions: Transaction[];
}

@Injectable()
export class FetchExpensesByDeliveryman {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({
    deliverymanId,
    pagination,
  }: FetchExpensesByDeliverymanRequest): Promise<FetchExpensesByDeliverymanResponse> {
    const transactions =
      await this.transactionRepository.findAllExpensesByDeliveryman(
        deliverymanId,
        pagination,
      );

    return {
      transactions,
    };
  }
}
