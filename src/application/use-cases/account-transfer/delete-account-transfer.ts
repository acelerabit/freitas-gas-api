import { AccountsTransferRepository } from '@/application/repositories/account-transfer';
import { Injectable } from '@nestjs/common';

interface DeleteAccountTransferRequest {
  accountTransferId: string;
}

@Injectable()
export class DeleteAccountTransfer {
  constructor(private accountTransfersRepository: AccountsTransferRepository) {}

  async execute({
    accountTransferId,
  }: DeleteAccountTransferRequest): Promise<void> {
    await this.accountTransfersRepository.delete(accountTransferId);

    return;
  }
}
