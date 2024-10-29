import { Transaction } from 'src/application/entities/transaction';
import { Prisma } from '@prisma/client';
import { User } from '@/application/entities/user';

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
        depositDate: transaction.depositDate,
        bank: transaction.bank,
        user: transaction.user
          ? User.create({
              email: transaction.user.email,
              name: transaction.user.name,
              role: transaction.user.role,
            })
          : null,
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
      depositDate: transaction.depositDate,
      bank: transaction.bank,
    };
  }
}
