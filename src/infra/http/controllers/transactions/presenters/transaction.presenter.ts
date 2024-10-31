import { Transaction } from '@/application/entities/transaction';

export class TransactionsPresenters {
  static toHTTP(transaction: Transaction) {
    return {
      id: transaction.id,
      transactionType: transaction.transactionType,
      category: transaction.category,
      customCategory: transaction.customCategory,
      amount: transaction.amount,
      description: transaction.description,
      createdAt: transaction.createdAt,
      bank: transaction.bank,
      user: transaction.user
        ? {
            id: transaction.user.id,
            name: transaction.user.name,
            email: transaction.user.email,
          }
        : null,
    };
  }
}
