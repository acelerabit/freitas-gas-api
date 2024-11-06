import { BankAccount } from '@/application/entities/bank-account';

export class BankAccountsPresenters {
  static toHTTP(bankAccount: BankAccount) {
    return {
      id: bankAccount.id,
      bank: bankAccount.bank,
      paymentsAssociated: bankAccount.paymentsAssociated,
      createdAt: bankAccount.createdAt
    };
  }
}
