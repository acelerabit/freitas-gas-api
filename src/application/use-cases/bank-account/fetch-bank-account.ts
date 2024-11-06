import { BankAccount } from '@/application/entities/bank-account';
import { BankAccountsRepository } from '@/application/repositories/bank-repositry';
import { Injectable } from '@nestjs/common';

interface FetchAllBankAccountsResponse {
  bankAccounts: BankAccount[];
}

@Injectable()
export class FetchAllBankAccounts {
  constructor(private bankAccountsRepository: BankAccountsRepository) { }

  async execute(): Promise<FetchAllBankAccountsResponse> {
    const bankAccounts = await this.bankAccountsRepository.findAllWithoutPaginate(
    );

    return { bankAccounts };
  }
}
