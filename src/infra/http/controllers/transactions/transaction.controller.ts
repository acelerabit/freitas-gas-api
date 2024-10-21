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
import { Role, TransactionCategory } from '@prisma/client';
import { Auth } from 'src/infra/decorators/auth.decorator';
import { CreateTransactionBody } from './dtos/create-transaction-body';
import { FindAllTransactionUseCase } from '@/application/use-cases/transaction/findall-transaction';
import { Transaction } from '@/application/entities/transaction';
import { PaginationParams } from '@/@shared/pagination-interface';
import { UpdateTransactionUseCase } from '@/application/use-cases/transaction/update-transaction';
import { FetchExpenseTypesUseCase } from '@/application/use-cases/transaction/fetch-expense-types';
import { FetchExpenses } from '@/application/use-cases/transaction/fetch-expenses';
import { SortType } from '@/application/repositories/transaction-repository';
import { CalculateCompanyBalance } from '@/application/use-cases/transaction/calculate-company-balance';
import { TransferToDeliveryman } from '@/application/use-cases/transaction/transfer-to-deliveryman';
import { TransferToDeliverymanBody } from './dtos/transfer-to-deliveryman-body';
import { GetExpenseIndicators } from '@/application/use-cases/transaction/get-expense-indicators';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private createTransaction: CreateTransactionUseCase,
    private findAllTransaction: FindAllTransactionUseCase,
    private deleteTransaction: DeleteTransaction,
    private updateTransaction: UpdateTransactionUseCase,
    private fetchExpenseTypesUseCase: FetchExpenseTypesUseCase,
    private fetchAllExpenses: FetchExpenses,
    private calculateCompanyBalance: CalculateCompanyBalance,
    private transferToDeliveryman: TransferToDeliveryman,
    private getExpenseIndicators: GetExpenseIndicators,
  ) {}

  @Post()
  async create(@Body() body: CreateTransactionBody) {
    await this.createTransaction.execute({
      ...body,
    });

    return;
  }

  @Get()
  async findAll(
    @Query()
    query: {
      type?: string;
      category?: TransactionCategory;
      orderByField?: SortType;
      orderDirection?: 'desc' | 'asc';
      page?: string;
      itemsPerPage?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Transaction[]> {
    const {
      category,
      type,
      orderByField,
      orderDirection,
      page,
      itemsPerPage,
      startDate,
      endDate,
    } = query;
    return this.findAllTransaction.execute({
      type,
      filterParams: {
        category,
        startDate,
        endDate,
      },
      orderByField,
      orderDirection,
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });
  }

  @Get('/expenses')
  async findAllExpenses(
    @Query() pagination: PaginationParams,
  ): Promise<Transaction[]> {
    return this.fetchAllExpenses.execute(pagination);
  }

  @Get('/balance')
  async balance(): Promise<number> {
    const { finalBalance } = await this.calculateCompanyBalance.execute();

    return finalBalance;
  }

  @Post('/transfer/:deliverymanId')
  async transfer(
    @Param('deliverymanId') deliverymanId: string,
    @Body() body: TransferToDeliverymanBody,
  ) {
    await this.transferToDeliveryman.execute({
      ...body,
      deliverymanId,
    });

    return;
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

  @Get('/expenses/indicators')
  async getIndicators(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('deliverymanId') deliverymanId?: string,
  ) {
    const result = await this.getExpenseIndicators.execute(
      new Date(startDate),
      new Date(endDate),
      deliverymanId,
    );
    return result;
  }
}
