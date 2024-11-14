import { AccountTransfer } from '@/application/entities/account-transfer';
import { BankAccount } from '@/application/entities/bank-account';
import { Prisma } from '@prisma/client';

export class PrismaAccountTransfersMapper {
  static toDomain(accountTransfer: any): AccountTransfer {
    return AccountTransfer.create(
      {
        originAccountId: accountTransfer.originAccountId,
        originAccount: accountTransfer.originAccount
          ? BankAccount.create({
              bank: accountTransfer.originAccount.bank,
            })
          : null,
        destinationAccountId: accountTransfer.destinationAccountId,
        destinationAccount: accountTransfer.destinationAccount
          ? BankAccount.create({
              bank: accountTransfer.destinationAccount.bank,
            })
          : null,
        value: accountTransfer.value,
        createdAt: accountTransfer.createdAt,
      },
      accountTransfer.id,
    );
  }

  static toPrisma(
    accountTransfer: AccountTransfer,
  ): Prisma.AccountTransferUncheckedCreateInput {
    return {
      id: accountTransfer.id,
      originAccountId: accountTransfer.originAccountId,
      destinationAccountId: accountTransfer.destinationAccountId,
      value: accountTransfer.value,
      createdAt: accountTransfer.createdAt,
    };
  }
}
