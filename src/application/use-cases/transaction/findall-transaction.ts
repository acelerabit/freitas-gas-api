import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import { TransactionRepository } from '@/application/repositories/transaction-repository';

@Injectable()
export class FindAllTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(pagination: PaginationParams): Promise<Transaction[]> {
    return this.transactionRepository.findAll(pagination);
  }
}
