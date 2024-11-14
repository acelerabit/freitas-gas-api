import { AccountTransfer } from '@/application/entities/account-transfer';
import { AccountsTransferRepository } from '@/application/repositories/account-transfer';
import { BadRequestException, Injectable } from '@nestjs/common';

export interface UpdateAccountTransferRequest {
  id: string;
  originAccountId: string;
  destinationAccountId: string;
  type?: 'caixa';
  value: number;
}

@Injectable()
export class UpdateAccountTransfer {
  constructor(private accountTransfersRepository: AccountsTransferRepository) {}

  async execute({
    id,
    originAccountId,
    destinationAccountId,
    type,
    value,
  }: UpdateAccountTransferRequest): Promise<void> {
    const accountTransfer = await this.accountTransfersRepository.findById(id);

    if (!accountTransfer) {
      throw new BadRequestException('Não foi possivel editar a transferência', {
        cause: new Error('Transferência não encontrada'),
        description: 'Transferência não encontrada',
      });
    }

    const updates: Partial<AccountTransfer> = {};

    if (originAccountId) {
      updates.originAccountId = originAccountId;
    }

    if (destinationAccountId) {
      updates.destinationAccountId = destinationAccountId;
    }

    if (type) {
      updates.type = type;
    }

    if (value) {
      updates.value = value * 100;
    }

    Object.assign(accountTransfer, updates);

    await this.accountTransfersRepository.update(accountTransfer);

    return;
  }
}
