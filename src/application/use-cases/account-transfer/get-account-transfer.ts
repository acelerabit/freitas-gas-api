import { PaginationParams } from '@/@shared/pagination-interface';
import { AccountTransfer } from '@/application/entities/account-transfer';
import { AccountsTransferRepository } from '@/application/repositories/account-transfer';
import { Injectable } from '@nestjs/common';

interface GetAccountTransferRequest {
  id: string;
}

interface GetAccountTransfersResponse {
  accountTransfer: AccountTransfer;
}

@Injectable()
export class GetAccountTransfers {
  constructor(private accountTransfersRepository: AccountsTransferRepository) {}

  async execute({
    id,
  }: GetAccountTransferRequest): Promise<GetAccountTransfersResponse> {
    const accountTransfer = await this.accountTransfersRepository.findById(id);

    return { accountTransfer };
  }
}
