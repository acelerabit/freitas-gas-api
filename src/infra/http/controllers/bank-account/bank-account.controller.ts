import { CreateBankAccounts } from '@/application/use-cases/bank-account/create-bank-account';
import { DeleteBankAccounts } from '@/application/use-cases/bank-account/delete-bank-account';
import { FetchAllBankAccounts } from '@/application/use-cases/bank-account/fetch-bank-account';
import { UpdateBankAccount } from '@/application/use-cases/bank-account/update-bank-account';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CreateBankAccountBody } from './dtos/create-bank-account-body';
import { UpdateBankAccountBody } from './dtos/update-bank-account-body';
import { BankAccountsPresenters } from './presenters/bank-account.presenter';

@Controller('bank-account')
export class BankAccountController {
  constructor(
    private createBankAccount: CreateBankAccounts,
    private fetchBankAccounts: FetchAllBankAccounts,
    private deleteBankAccount: DeleteBankAccounts,
    private updateBankAccount: UpdateBankAccount
  ) {}

  @Post()
  async create(
    @Body() body: CreateBankAccountBody,
  ): Promise<void> {
    const {bank, paymentsAssociated} = body

    await this.createBankAccount.execute({
      bank,
      paymentsAssociated
    });
  }

  @Put('/:id')
  async update(
    @Param("id") id: string,
    @Body() body: UpdateBankAccountBody,
  ): Promise<void> {
    const {bank, paymentsAssociated} = body

    await this.updateBankAccount.execute({
      id,
      bank,
      paymentsAssociated
    });
  }

  @Get()
  async findAll() {
    const {bankAccounts} = await this.fetchBankAccounts.execute();


    return bankAccounts.map(BankAccountsPresenters.toHTTP)
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    await this.deleteBankAccount.execute({
      bankId: id
    });


    return
  }
  
}
