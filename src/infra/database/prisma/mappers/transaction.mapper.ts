import { Transaction } from 'src/application/entities/transaction';
import { Prisma } from '@prisma/client';
import { User } from '@/application/entities/user';
import { BankAccount } from '@/application/entities/bank-account';

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
        createdAt: transaction.createdAt,
        senderUserId: transaction.senderUserId,
        bank: transaction.bank,
        bankAccountId: transaction.bankAccountId,
        bankAccount: transaction.bankAccount
          ? BankAccount.create({
              bank: transaction.bankAccount.bank,
              paymentsAssociated: transaction.bankAccount.paymentsAssociated,
            })
          : null,
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
      bankAccountId: transaction.bankAccountId,
      senderUserId: transaction.senderUserId,
      createdAt: transaction.createdAt,
    };
  }
}
