import { PaginationParams } from '@/@shared/pagination-interface';
import { AccountTransfer } from '@/application/entities/account-transfer';
import { AccountsTransferRepository } from '@/application/repositories/account-transfer';
import { Injectable } from '@nestjs/common';

interface FetchAllAccountTransferRequest {
  pagination: PaginationParams;
}

interface FetchAllAccountTransfersResponse {
  accountTransfers: AccountTransfer[];
}

@Injectable()
export class FetchAllAccountTransfers {
  constructor(private accountTransfersRepository: AccountsTransferRepository) {}

  async execute({
    pagination,
  }: FetchAllAccountTransferRequest): Promise<FetchAllAccountTransfersResponse> {
    const accountTransfers = await this.accountTransfersRepository.findAll(
      pagination,
    );

    return { accountTransfers };
  }
}
