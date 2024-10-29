import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import { TransactionRepository } from '@/application/repositories/transaction-repository';

interface FetchDepositsByDeliverymanRequest {
  deliverymanId: string;
  pagination: PaginationParams;
}

interface FetchDepositsByDeliverymanResponse {
  transactions: Transaction[];
}

@Injectable()
export class FetchDepositsByDeliveryman {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({
    deliverymanId,
    pagination,
  }: FetchDepositsByDeliverymanRequest): Promise<FetchDepositsByDeliverymanResponse> {
    const transactions =
      await this.transactionRepository.findAllDepositsByDeliveryman(
        deliverymanId,
        pagination,
      );

    return {
      transactions,
    };
  }
}
