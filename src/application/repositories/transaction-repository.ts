import { Transaction } from '../entities/transaction';

export abstract class TransactionRepository {
  abstract createTransaction(transaction: Transaction): Promise<void>;
}
