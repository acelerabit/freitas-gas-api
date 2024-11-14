import { AccountTransfer } from '@/application/entities/account-transfer';
import { AccountsTransferRepository } from '@/application/repositories/account-transfer';
import { BadRequestException, Injectable } from '@nestjs/common';

interface CreateAccountTransferRequest {
  originAccountId: string;
  destinationAccountId: string;
  type?: 'caixa';
  value: number;
}

@Injectable()
export class CreateAccountTransfer {
  constructor(private accountTransferRepository: AccountsTransferRepository) {}

  async execute({
    originAccountId,
    destinationAccountId,
    value,
    type,
  }: CreateAccountTransferRequest): Promise<void> {
    if (value <= 0) {
      throw new BadRequestException('O valor deve ser maior que zero', {
        cause: new Error('O valor deve ser maior que zero'),
        description: 'O valor deve ser maior que zero',
      });
    }

    // if (type && type === 'caixa') {
    //   const accountTransfer = AccountTransfer.create({
    //     originAccountId,
    //     destinationAccountId,
    //     type,
    //     value: value * 100,
    //   });

    //   await this.accountTransferRepository.create(accountTransfer);

    //   return;
    // }

    const accountTransfer = AccountTransfer.create({
      originAccountId,
      destinationAccountId,
      value: value * 100,
    });

    await this.accountTransferRepository.create(accountTransfer);

    return;
  }
}
