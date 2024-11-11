import { BankAccount } from '@/application/entities/bank-account';
import { BankAccountsRepository } from '@/application/repositories/bank-repositry';
import { BadRequestException, Injectable } from '@nestjs/common';

interface CreateBankAccountRequest {
  bank: string;
  paymentsAssociated: string[]
}

@Injectable()
export class CreateBankAccounts {
  constructor(private bankAccountsRepository: BankAccountsRepository) { }

  async execute({ bank, paymentsAssociated }: CreateBankAccountRequest): Promise<void> {
    const hasSomeWithSameName = await this.bankAccountsRepository.alreadyGotThisName(bank);
    
    if(hasSomeWithSameName){
      throw new BadRequestException('Já existe alguma conta com esse nome', {
        cause: new Error('Já existe alguma conta com esse nome'),
        description: 'Já existe alguma conta com esse nome',
      });
    }

    const hastSomeWithThisPaymentsMethods = await this.bankAccountsRepository.alreadyGotThisPaymentMethods(paymentsAssociated);
    
    if(hastSomeWithThisPaymentsMethods){
      throw new BadRequestException('Já existe alguma conta com algum desses tipos de pagamento', {
        cause: new Error('Já existe alguma conta com algum desses tipos de pagamento'),
        description: 'Já existe alguma conta com algum desses tipos de pagamento',
      });
    }
    
    const bankAccount = BankAccount.create({
      bank,
      paymentsAssociated
    })

    await this.bankAccountsRepository.create(
      bankAccount
    );

    return
  }
}
