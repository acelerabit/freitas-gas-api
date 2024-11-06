import { BankAccount } from '@/application/entities/bank-account';
import { Prisma } from '@prisma/client';

export class PrismaBankAccountsMapper {
  static toDomain(bankAccount: any): BankAccount {
    return BankAccount.create(
      {
        bank: bankAccount.bank,

        createdAt: bankAccount.createdAt,
        paymentsAssociated: bankAccount.paymentsAssociated,
      },
      bankAccount.id,
    );
  }

  static toPrisma(bankAccount: BankAccount): Prisma.BankAccountUncheckedCreateInput {
    return {
      id: bankAccount.id,
      bank: bankAccount.bank,
      createdAt: bankAccount.createdAt,
      paymentsAssociated: bankAccount.paymentsAssociated,
    };
  }
}
