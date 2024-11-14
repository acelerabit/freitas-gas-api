import { TransactionRepository } from '@/application/repositories/transaction-repository';
import { Injectable } from '@nestjs/common';

interface CalculateAccountsCompanyBalanceResponse {
  balances: {
    bank: string;
    balance: number;
  }[];
}

@Injectable()
export class CalculateAccountsCompanyBalance {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<CalculateAccountsCompanyBalanceResponse> {
    const balances =
      await this.transactionRepository.calculateAccountsBalance();

    return { balances };
  }
}
