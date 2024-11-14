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
import { GetExpenseProportionByCategoryUseCase } from '@/application/use-cases/transaction/get-expense-proportion-by-category';
import { FetchExpensesByDeliveryman } from '@/application/use-cases/transaction/fetch-expenses-by-deliveryman';
import { ExpensesPresenters } from './presenters/expense.presenter';
import { GetTotalExpensesDeliverymanToday } from '@/application/use-cases/transaction/get-total-expenses-deliveryman-today';
import { CalculateDeliverymanBalance } from '@/application/use-cases/transaction/calculate-deliberyman-balance';
import { DepositToCompanyUseCase } from '@/application/use-cases/transaction/deposit-to-company';
import { DepositToCompanyBody } from './dtos/deposit-to-company-body';
import { GetSalesVsExpensesComparisonUseCase } from '@/application/use-cases/transaction/get-salevsexpense-comparisom';
import { GetSalesVsExpensesComparisonResponse } from '@/application/use-cases/transaction/get-salevsexpense-comparisom';
import { CalculateGrossProfit } from '@/application/use-cases/transaction/get-gross-profit';
import { FetchDeposits } from '@/application/use-cases/transaction/fetch-deposits';
import { FetchDepositsByDeliveryman } from '@/application/use-cases/transaction/fetch-deliveryman-deposits';
import { TransactionsPresenters } from './presenters/transaction.presenter';
import { FetchIncomeTypesUseCase } from '@/application/use-cases/transaction/fetch-income-types';
import { CalculateAccountsCompanyBalance } from '@/application/use-cases/transaction/calculate-accounts-company-balance';

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
    private readonly getExpenseProportionByCategoryUseCase: GetExpenseProportionByCategoryUseCase,
    private fetchAllDeliverymanExpenses: FetchExpensesByDeliveryman,
    private getTotalExpensesDeliverymanToday: GetTotalExpensesDeliverymanToday,
    private calculateDeliverymanBalance: CalculateDeliverymanBalance,
    private depositToCompany: DepositToCompanyUseCase,
    private getSalesVsExpensesComparisonUseCase: GetSalesVsExpensesComparisonUseCase,
    private calculateGrossProfit: CalculateGrossProfit,
    private fetchDeposits: FetchDeposits,
    private fetchDepositsByDeliveryman: FetchDepositsByDeliveryman,
    private fetchIncomeTypesUseCase: FetchIncomeTypesUseCase,
    private calculateAccountsCompanyBalance: CalculateAccountsCompanyBalance,
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
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Transaction[]> {
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setHours(0, 0, 0, 0));
    const end = endDate
      ? new Date(endDate)
      : new Date(new Date().setHours(23, 59, 59, 999));

    return this.fetchAllExpenses.execute(pagination, start, end);
  }

  @Get('/expenses-total-today/:deliverymanId')
  async expensesToday(
    @Param('deliverymanId') deliverymanId: string,
  ): Promise<number> {
    return this.getTotalExpensesDeliverymanToday.execute({
      deliverymanId,
    });
  }

  @Get('/expenses/deliveryman/:id')
  async FindAllDeliverymanExpenses(
    @Param('id') id: string,
    @Query()
    query: {
      page?: string;
      itemsPerPage?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const { page, itemsPerPage, startDate, endDate } = query;
    const { transactions } = await this.fetchAllDeliverymanExpenses.execute({
      deliverymanId: id,
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return transactions.map(ExpensesPresenters.toHTTP);
  }

  @Get('/deposits/deliveryman/:id')
  async FindAllDeliverymanDeposits(
    @Param('id') id: string,
    @Query()
    query: {
      page?: string;
      itemsPerPage?: string;
    },
  ) {
    const { page, itemsPerPage } = query;
    const { transactions } = await this.fetchDepositsByDeliveryman.execute({
      deliverymanId: id,
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return transactions.map(ExpensesPresenters.toHTTP);
  }

  @Get('/deposits')
  async FindAllDeposits(
    @Query()
    query: {
      page?: string;
      itemsPerPage?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const { page, itemsPerPage, startDate, endDate } = query;

    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    const { transactions } = await this.fetchDeposits.execute({
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
      startDate: startDateObj,
      endDate: endDateObj,
    });

    return transactions.map(TransactionsPresenters.toHTTP);
  }

  @Get('/balance')
  async balance(): Promise<number> {
    const { finalBalance } = await this.calculateCompanyBalance.execute();

    return finalBalance;
  }

  @Get('/balances')
  async balances() {
    const { balances } = await this.calculateAccountsCompanyBalance.execute();

    return balances;
  }

  @Get('/deliveryman/balance/:deliverymanId')
  async deliverymanBalance(
    @Param('deliverymanId') deliverymanId: string,
  ): Promise<number> {
    const { finalBalance } = await this.calculateDeliverymanBalance.execute({
      deliverymanId,
    });

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

  @Post('/deposit')
  async deposit(@Body() body: DepositToCompanyBody) {
    await this.depositToCompany.execute({
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

  @Get('/income/types')
  async fetchIncomeTypes() {
    const { incomeTypes } = await this.fetchIncomeTypesUseCase.execute();

    return incomeTypes.map((incomeType) => {
      return {
        id: incomeType.id,
        name: incomeType.name,
      };
    });
  }

  @Auth(Role.ADMIN)
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

  @Auth(Role.ADMIN)
  @Get('/expenses/proportion-by-category')
  async getExpenseProportionByCategory(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('deliverymanId') deliverymanId?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const expenseProportions =
      await this.getExpenseProportionByCategoryUseCase.execute(
        start,
        end,
        deliverymanId,
      );

    return expenseProportions;
  }

  @Auth(Role.ADMIN)
  @Get('/expenses/sales-vs-expenses')
  async getSalesVsExpensesComparison(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('deliverymanId') deliverymanId?: string,
  ): Promise<GetSalesVsExpensesComparisonResponse> {
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;

    const result = await this.getSalesVsExpensesComparisonUseCase.execute({
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      deliverymanId,
    });

    return result;
  }

  @Auth(Role.ADMIN)
  @Get('gross-profit')
  async getGrossProfit(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('deliverymanId') deliverymanId?: string,
  ): Promise<number> {
    const result = await this.calculateGrossProfit.execute(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      deliverymanId,
    );
    return result;
  }
}
