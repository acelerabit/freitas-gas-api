import { Transaction } from '@/application/entities/transaction';
import { TransactionRepository } from '@/application/repositories/transaction-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transaction: Transaction): Promise<void> {
    await this.transactionRepository.update(transaction);
  }
}
