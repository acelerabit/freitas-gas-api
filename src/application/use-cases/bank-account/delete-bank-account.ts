import { BankAccountsRepository } from '@/application/repositories/bank-repositry';
import { Injectable } from '@nestjs/common';

interface DeleteBankAccountRequest {
  bankId: string;
}

@Injectable()
export class DeleteBankAccounts {
  constructor(private bankAccountsRepository: BankAccountsRepository) { }

  async execute({ bankId }: DeleteBankAccountRequest): Promise<void> {
    await this.bankAccountsRepository.delete(
      bankId
    );

    return
  }
}
