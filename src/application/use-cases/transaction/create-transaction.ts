import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { Transaction } from '../../entities/transaction';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transaction: Transaction): Promise<void> {
    await this.transactionRepository.createTransaction(transaction);
  }
}
