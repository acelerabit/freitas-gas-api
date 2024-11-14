import { AccountTransfer } from '@/application/entities/account-transfer';

export class AccountTransfersPresenters {
  static toHTTP(accountTransfer: AccountTransfer) {
    return {
      id: accountTransfer.id,
      originAccountId: accountTransfer.originAccountId,
      originAccount: {
        bank: accountTransfer.originAccount.bank,
      },
      destinationAccountId: accountTransfer.destinationAccountId,
      destinationAccount: {
        bank: accountTransfer.destinationAccount.bank,
      },
      value: accountTransfer.value,
      createdAt: accountTransfer.createdAt,
    };
  }
}
