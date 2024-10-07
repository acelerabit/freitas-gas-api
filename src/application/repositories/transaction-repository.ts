import { Transaction } from '../entities/transaction';
import { PaginationParams } from '@/@shared/pagination-interface';

export abstract class TransactionRepository {
  abstract createTransaction(transaction: Transaction): Promise<void>;
  abstract findAll(pagination: PaginationParams): Promise<Transaction[]>;
  abstract findById(id: string): Promise<Transaction | null>;
  abstract update(transaction: Transaction): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
