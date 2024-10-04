import { Transaction } from '../entities/transaction';

export abstract class TransactionRepository {
  abstract createTransaction(transaction: Transaction): Promise<void>;
  abstract findById(id: string): Promise<Transaction | null>;
  abstract update(transaction: Transaction): Promise<void>;
}
