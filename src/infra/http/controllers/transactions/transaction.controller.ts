import { CreateTransactionUseCase } from '@/application/use-cases/transaction/create-transaction';
import { DeleteTransaction } from '@/application/use-cases/transaction/delete-transaction';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/infra/decorators/auth.decorator';
import { CreateTransactionBody } from './dtos/create-transaction-body';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private createTransaction: CreateTransactionUseCase,
    private deleteTransaction: DeleteTransaction,
  ) {}

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() body: CreateTransactionBody) {
    await this.createTransaction.execute({
      ...body,
    });

    return;
  }

  @Auth(Role.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.deleteTransaction.execute({ id });
    return;
  }
}
