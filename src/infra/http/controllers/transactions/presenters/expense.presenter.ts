import { Transaction } from '@/application/entities/transaction';

export class ExpensesPresenters {
  static toHTTP(transaction: Transaction) {
    return {
      id: transaction.id,
      transactionType: transaction.transactionType,
      category: transaction.category,
      customCategory: transaction.customCategory,
      amount: transaction.amount,
      description: transaction.description,
      createdAt: transaction.createdAt,
    };
  }
}
