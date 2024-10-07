import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from 'src/application/repositories/transaction-repository';

@Injectable()
export class DeleteTransaction {
  constructor(private transactionsRepository: TransactionRepository) {}

  async execute({ id }: { id: string }) {
    const transaction = await this.transactionsRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.transactionsRepository.delete(id);
  }
}
