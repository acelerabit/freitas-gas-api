import { BankAccount } from '@/application/entities/bank-account';
import { BankAccountsRepository } from '@/application/repositories/bank-repositry';
import { BadRequestException, Injectable } from '@nestjs/common';

interface GetBankAccountRequest {
  id: string;
}

interface GetBankAccountResponse {
  bankAccount: BankAccount;
}

@Injectable()
export class GetBankAccount {
  constructor(private bankAccountsRepository: BankAccountsRepository) { }

  async execute({ id }: GetBankAccountRequest): Promise<GetBankAccountResponse> {
    const bankAccount = await this.bankAccountsRepository.findById(id);

    if(!bankAccount) {
      throw new BadRequestException('Conta não encontrada', {
        cause: new Error('Conta não encontrada'),
        description: 'Conta não encontrada',
      });
    }

    return { bankAccount };
  }
}
