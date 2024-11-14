import { BankAccount } from '@/application/entities/bank-account';
import { BankAccountsRepository } from '@/application/repositories/bank-repositry';
import { BadRequestException, Injectable } from '@nestjs/common';

export interface UpdateBankAccountRequest {
  id: string;
  bank: string;
  paymentsAssociated: string[];
}

@Injectable()
export class UpdateBankAccount {
  constructor(private bankAccountsRepository: BankAccountsRepository) {}

  async execute({
    id,
    bank,
    paymentsAssociated,
  }: UpdateBankAccountRequest): Promise<void> {
    const bankAccount = await this.bankAccountsRepository.findById(id);

    if (!bankAccount) {
      throw new BadRequestException('Não foi possivel editar o a conta', {
        cause: new Error('Conta não encontrada'),
        description: 'Conta não encontrada',
      });
    }

    const hastSomeWithThisPaymentsMethods =
      await this.bankAccountsRepository.alreadyGotThisPaymentMethods(
        paymentsAssociated,
        id,
      );

    if (hastSomeWithThisPaymentsMethods) {
      throw new BadRequestException(
        'Já existe alguma conta com algum desses tipos de pagamento',
        {
          cause: new Error(
            'Já existe alguma conta com algum desses tipos de pagamento',
          ),
          description:
            'Já existe alguma conta com algum desses tipos de pagamento',
        },
      );
    }

    const updates: Partial<BankAccount> = {};

    if (bank) {
      updates.bank = bank;
    }

    if (paymentsAssociated) {
      updates.paymentsAssociated = paymentsAssociated;
    }

    Object.assign(bankAccount, updates);

    await this.bankAccountsRepository.update(bankAccount);

    return;
  }
}
