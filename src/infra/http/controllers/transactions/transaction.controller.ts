import { CreateTransactionUseCase } from '@/application/use-cases/transaction/create-transaction';
import { DeleteTransaction } from '@/application/use-cases/transaction/delete-transaction';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/infra/decorators/auth.decorator';
import { CreateTransactionBody } from './dtos/create-transaction-body';
import { FindAllTransactionUseCase } from '@/application/use-cases/transaction/findall-transaction';
import { Transaction } from '@/application/entities/transaction';
import { PaginationParams } from '@/@shared/pagination-interface';
import { UpdateTransactionUseCase } from '@/application/use-cases/transaction/update-transaction';
import { FetchExpenseTypesUseCase } from '@/application/use-cases/transaction/fetch-expense-types';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private createTransaction: CreateTransactionUseCase,
    private findAllTransaction: FindAllTransactionUseCase,
    private deleteTransaction: DeleteTransaction,
    private updateTransaction: UpdateTransactionUseCase,
    private fetchExpenseTypesUseCase: FetchExpenseTypesUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateTransactionBody) {
    await this.createTransaction.execute({
      ...body,
    });

    return;
  }

  @Get()
  async findAll(@Query() pagination: PaginationParams): Promise<Transaction[]> {
    return this.findAllTransaction.execute(pagination);
  }

  @Auth(Role.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.deleteTransaction.execute({ id });
    return;
  }

  @Auth(Role.ADMIN)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() transactionData: Partial<Transaction>,
  ): Promise<void> {
    const transaction = Transaction.create(
      {
        ...transactionData,
        transactionType: transactionData.transactionType,
        amount: transactionData.amount,
        category: transactionData.category,
        userId: transactionData.userId,
        customCategory: transactionData.customCategory,
        description: transactionData.description,
        createdAt: transactionData.createdAt,
      } as Transaction,
      id,
    );
    await this.updateTransaction.execute(transaction);
  }

  @Get('/expense/types')
  async fetchTypes() {
    const { expenseTypes } = await this.fetchExpenseTypesUseCase.execute();

    return expenseTypes.map((expenseType) => {
      return {
        id: expenseType.id,
        name: expenseType.name,
      };
    });
  }
}
