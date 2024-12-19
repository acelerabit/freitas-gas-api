import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/application/repositories/transaction-repository';
import { PaginationParams } from '@/@shared/pagination-interface';

@Injectable()
export class GetDeliverymenCashBalancesUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(pagination: PaginationParams): Promise<
    {
      name: string;
      cashBalance: number;
    }[]
  > {
    return this.transactionRepository.getDeliverymenCashBalances(pagination);
  }
}
