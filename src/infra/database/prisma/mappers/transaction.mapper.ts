import { Transaction } from 'src/application/entities/transaction';
import { Prisma } from '@prisma/client';

export class PrismaTransactionsMapper {
  static toDomain(transaction: any) {
    return Transaction.create(
      {
        amount: transaction.amount,
        category: transaction.category,
        mainAccount: transaction.mainAccount,
        transactionType: transaction.transactionType,
        userId: transaction.userId,
        customCategory: transaction.customCategory,
        referenceId: transaction.referenceId,
        description: transaction.description,
      },
      transaction.id,
    );
  }

  static toPrisma(
    transaction: Transaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      id: transaction.id,
      amount: transaction.amount,
      category: transaction.category,
      mainAccount: transaction.mainAccount,
      transactionType: transaction.transactionType,
      userId: transaction.userId,
      customCategory: transaction.customCategory,
      referenceId: transaction.referenceId,
      description: transaction.description,
    };
  }
}
