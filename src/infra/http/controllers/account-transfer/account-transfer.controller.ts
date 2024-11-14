import { CreateAccountTransfer } from '@/application/use-cases/account-transfer/create-account-transfer';
import { DeleteAccountTransfer } from '@/application/use-cases/account-transfer/delete-account-transfer';
import { FetchAllAccountTransfers } from '@/application/use-cases/account-transfer/fetch-account-transfers';
import { UpdateAccountTransfer } from '@/application/use-cases/account-transfer/update-account-transfer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AccountTransfersPresenters } from './presenters/account-transfer.presenter';
import { UpdateAccountTransferBody } from './dtos/update-account-transfer';
import { CreateAccountTransferBody } from './dtos/create-account-transfer';
import { PaginationParams } from '@/@shared/pagination-interface';
import { GetAccountTransfers } from '@/application/use-cases/account-transfer/get-account-transfer';

@Controller('account-transfer')
export class AccountTransferController {
  constructor(
    private createAccountTransfer: CreateAccountTransfer,
    private fetchAccountTransfers: FetchAllAccountTransfers,
    private deleteAccountTransfer: DeleteAccountTransfer,
    private updateAccountTransfer: UpdateAccountTransfer,
    private getAccountTransfer: GetAccountTransfers,
  ) {}

  @Post()
  async create(@Body() body: CreateAccountTransferBody): Promise<void> {
    const { destinationAccountId, originAccountId, value } = body;

    await this.createAccountTransfer.execute({
      destinationAccountId,
      originAccountId,
      value,
    });
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAccountTransferBody,
  ): Promise<void> {
    const { destinationAccountId, originAccountId, value } = body;

    await this.updateAccountTransfer.execute({
      id,
      destinationAccountId,
      originAccountId,
      value,
    });

    return;
  }

  @Get('/get/:id')
  async get(@Param('id') id: string) {
    const { accountTransfer } = await this.getAccountTransfer.execute({
      id,
    });

    return AccountTransfersPresenters.toHTTP(accountTransfer);
  }

  @Get()
  async findAll(
    @Query()
    query: {
      page?: string;
      itemsPerPage?: string;
    },
  ) {
    const { itemsPerPage, page } = query;

    const { accountTransfers } = await this.fetchAccountTransfers.execute({
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return accountTransfers.map(AccountTransfersPresenters.toHTTP);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.deleteAccountTransfer.execute({
      accountTransferId: id,
    });

    return;
  }
}
