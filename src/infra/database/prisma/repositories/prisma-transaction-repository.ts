import {
  SortType,
  TransactionRepository,
} from '../../../../application/repositories/transaction-repository';
import { Transaction } from '../../../../application/entities/transaction';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaTransactionsMapper } from '../mappers/transaction.mapper';
import { PaginationParams } from '@/@shared/pagination-interface';
import { TransactionCategory } from '@prisma/client';
import { DateService } from '@/infra/dates/date.service';

@Injectable()
export class PrismaTransactionRepository extends TransactionRepository {
  constructor(
    private prismaService: PrismaService,
    private dateService: DateService,
  ) {
    super();
  }

  async createTransaction(transaction: Transaction): Promise<void> {
    const transactionData = {
      id: transaction.id,
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      //mainAccount: transaction.mainAccount ?? false,
      category: transaction.category,
      userId: transaction.userId,
      referenceId: transaction.referenceId ?? null,
      createdAt: transaction.createdAt,
      customCategory: transaction.customCategory ?? null,
      description: transaction.description,
      depositDate: transaction.depositDate,
      bank: transaction.bank,
    };

    await this.prismaService.transaction.create({
      data: transactionData,
    });
  }

  async findAll(
    type?: 'INCOME' | 'WITHDRAW',
    orderByField?: SortType,
    orderDirection?: 'desc' | 'asc',
    filterParams?: {
      category?: TransactionCategory;
      startDate: Date;
      endDate: Date;
    },
    pagination?: PaginationParams,
  ): Promise<Transaction[]> {
    const orderBy = {};

    orderBy[orderByField] = orderDirection;

    let whereFilter = {};

    if (filterParams) {
      if (filterParams.category) {
        whereFilter = { ...whereFilter, category: filterParams.category };
      }

      if (filterParams.startDate && filterParams.endDate) {
        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: this.dateService.toDate(filterParams.startDate),
            lte: this.dateService.toDate(filterParams.endDate),
          },
        };
      }
    }

    if (type) {
      const raw = await this.prismaService.transaction.findMany({
        ...(pagination?.itemsPerPage ? { take: pagination.itemsPerPage } : {}),
        ...(pagination?.page
          ? { skip: (pagination.page - 1) * pagination.itemsPerPage }
          : {}),
        where: {
          OR: [
            {
              customCategory: type
                ? {
                    contains: type,
                    mode: 'insensitive',
                  }
                : {},
            },
          ],
          ...whereFilter,
        },
        orderBy: orderBy,
      });

      return raw.map(PrismaTransactionsMapper.toDomain);
    }

    const raw = await this.prismaService.transaction.findMany({
      ...(pagination?.itemsPerPage ? { take: pagination.itemsPerPage } : {}),
      ...(pagination?.page
        ? { skip: (pagination.page - 1) * pagination.itemsPerPage }
        : {}),
      where: {
        ...whereFilter,
      },
      orderBy: orderBy,
    });

    return raw.map(PrismaTransactionsMapper.toDomain);

    // const transactions = await this.prismaService.transaction.findMany({
    //   take: Number(pagination.itemsPerPage),
    //   skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    // });
    // return transactions.map(PrismaTransactionsMapper.toDomain);
  }

  async findAllWithoutPaginate(): Promise<Transaction[]> {
    const transactions = await this.prismaService.transaction.findMany();
    return transactions.map(PrismaTransactionsMapper.toDomain);
  }

  async findAllExpenses(pagination: PaginationParams): Promise<Transaction[]> {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        category: 'EXPENSE',
      },
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
    });
    return transactions.map(PrismaTransactionsMapper.toDomain);
  }

  async findAllExpensesByDeliveryman(
    deliverymanId: string,
    pagination: PaginationParams,
  ): Promise<Transaction[]> {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        AND: [
          {
            category: 'EXPENSE',
          },
          {
            userId: deliverymanId,
          },
        ],
      },
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map(PrismaTransactionsMapper.toDomain);
  }

  async getTotalExpensesByDeliveryman(id: string): Promise<number> {
    const { startOfDay, endOfDay } = this.dateService.startAndEndOfTheDay(); // Fim do dia atual

    const total = await this.prismaService.transaction.aggregate({
      _sum: {
        amount: true, // Soma do campo amount
      },
      where: {
        AND: [
          {
            category: 'EXPENSE',
          },
          {
            userId: id,
          },
          {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        ],
      },
    });

    return total._sum.amount || 0;
  }

  async findById(id: string): Promise<Transaction | null> {
    const raw = await this.prismaService.transaction.findFirst({
      where: {
        id,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaTransactionsMapper.toDomain(raw);
  }

  async calculateBalance(): Promise<number> {
    const transactionsSummary = await this.prismaService.transaction.groupBy({
      by: ['category'],
      _sum: {
        amount: true,
      },
      where: {
        category: {
          in: ['DEPOSIT', 'SALE', 'INCOME', 'EXPENSE', 'WITHDRAW', 'TRANSFER'],
        },
      },
    });

    const incomeTotal = transactionsSummary
      .filter((t) => ['DEPOSIT', 'INCOME'].includes(t.category)) // Primeiro filtro para 'DEPOSIT' e 'INCOME'
      .reduce((acc, curr) => acc + (curr._sum.amount || 0), 0);

    // Somar apenas as transações do tipo 'SALE' que não tenham o 'paymentMethod' como 'DINHEIRO'
    const saleTransactions = await this.prismaService.transaction.findMany({
      where: {
        category: 'SALE',
        sales: {
          some: {
            paymentMethod: {
              not: 'DINHEIRO',
            },
          },
        },
      },
    });

    const saleSummary = saleTransactions.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { _sum: { amount: 0 } };
      }
      acc[curr.category]._sum.amount += curr.amount || 0;
      return acc;
    }, {});

    const saleTotal = saleSummary['SALE'] ? saleSummary['SALE']._sum.amount : 0;

    // Consulta separada para somar apenas as despesas onde o user.role é 'ADMIN'
    const expenseTransactions = await this.prismaService.transaction.groupBy({
      by: ['category'],
      _sum: {
        amount: true,
      },
      where: {
        category: {
          in: ['EXPENSE', 'WITHDRAW', 'TRANSFER'],
        },
        user: {
          role: 'ADMIN',
        },
      },
    });

    const expenseTotal = expenseTransactions.reduce(
      (acc, curr) => acc + (curr._sum.amount || 0),
      0,
    );

    const finalBalance = incomeTotal + saleTotal - expenseTotal;

    return finalBalance;
  }

  async calculateDeliverymanBalance(deliverymanId: string): Promise<number> {
    const deliveryman = await this.prismaService.user.findUnique({
      where: {
        id: deliverymanId,
      },
    });

    if (!deliveryman) {
      return 0;
    }

    const saleTransactions = await this.prismaService.transaction.findMany({
      where: {
        category: 'SALE',
        userId: deliverymanId,
        sales: {
          some: {
            paymentMethod: {
              equals: 'DINHEIRO',
            },
          },
        },
      },
    });

    // Somar as transações 'SALE'
    const saleTotal = saleTransactions.reduce((acc, curr) => {
      return acc + (curr.amount || 0);
    }, 0);

    const expenseTransactions = await this.prismaService.transaction.findMany({
      where: {
        category: {
          in: ['EXPENSE', 'DEPOSIT'],
        },
        userId: deliverymanId,
      },
    });

    const expenseTotal = expenseTransactions.reduce((acc, curr) => {
      return acc + (curr.amount || 0);
    }, 0);

    const finalBalance = deliveryman.accountAmount + saleTotal - expenseTotal;

    return finalBalance;
  }

  async update(transaction: Transaction): Promise<void> {
    const toPrisma = PrismaTransactionsMapper.toPrisma(transaction);

    if (!transaction.id) {
      throw new Error('ID da transação não pode ser indefinido.');
    }

    const existingTransaction = await this.prismaService.transaction.findUnique(
      {
        where: { id: transaction.id },
      },
    );

    if (!existingTransaction) {
      throw new Error(`Transação com ID ${transaction.id} não encontrada.`);
    }

    await this.prismaService.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        ...toPrisma,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.transaction.delete({
      where: {
        id,
      },
    });
  }

  async getExpenseIndicators(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<{
    totalExpenses: number;
    totalPerDay: { createdAt: Date; total: number }[];
    totalPerMonth: { year: number; month: number; total: number }[];
  }> {
    const whereFilter: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      category: TransactionCategory.EXPENSE,
      ...(deliverymanId ? { userId: deliverymanId } : {}),
    };

    const totalExpenses = await this.prismaService.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: whereFilter,
    });

    const expensesPerDay = await this.prismaService.transaction.findMany({
      where: whereFilter,
      select: {
        createdAt: true,
        amount: true,
      },
    });

    const totalPerDay = expensesPerDay.reduce((acc, expense) => {
      const date = expense.createdAt.toISOString().split('T')[0];

      if (!acc[date]) {
        acc[date] = { createdAt: expense.createdAt, total: 0 };
      }

      acc[date].total += Number(expense.amount) / 100;
      return acc;
    }, {} as Record<string, { createdAt: Date; total: number }>);

    const formattedTotalPerDay = Object.values(totalPerDay);

    const expensesPerMonth = await this.prismaService.transaction.groupBy({
      by: ['createdAt'],
      where: whereFilter,
      _sum: {
        amount: true,
      },
    });

    const totalPerMonth = expensesPerMonth.map((expense) => {
      const date = new Date(expense.createdAt);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        total: Number(expense._sum.amount) / 100,
      };
    });

    return {
      totalExpenses: Number(totalExpenses._sum.amount || 0) / 100,
      totalPerDay: formattedTotalPerDay,
      totalPerMonth,
    };
  }
  async getExpenseProportionByCustomCategory(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<{ category: string; percentage: number }[]> {
    const whereFilter: any = {
      category: TransactionCategory.EXPENSE,
      ...(deliverymanId ? { userId: deliverymanId } : {}),
    };

    if (startDate && endDate) {
      whereFilter.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const totalExpenses = await this.prismaService.transaction.aggregate({
      _sum: { amount: true },
      where: whereFilter,
    });

    const expenseByCategory = await this.prismaService.transaction.groupBy({
      by: ['customCategory'],
      _sum: { amount: true },
      where: whereFilter,
    });

    const totalAmount = totalExpenses._sum.amount || 0;

    return expenseByCategory.map((expense) => ({
      category: expense.customCategory,
      percentage:
        totalAmount > 0
          ? Number(((expense._sum.amount / totalAmount) * 100).toFixed(2))
          : 0,
    }));
  }
  async getSalesVsExpensesComparison(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<{
    totalSales: { year: number; month: number; total: number }[];
    totalExpenses: { year: number; month: number; total: number }[];
  }> {
    const totalSales = await this.prismaService.transaction.groupBy({
      by: ['userId'],
      where: {
        category: TransactionCategory.SALE,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(deliverymanId && { userId: deliverymanId }),
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpenses = await this.prismaService.transaction.groupBy({
      by: ['userId'],
      where: {
        category: TransactionCategory.EXPENSE,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(deliverymanId && { userId: deliverymanId }),
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalSales: totalSales.map(({ _sum }) => ({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        total: _sum.amount || 0,
      })),
      totalExpenses: totalExpenses.map(({ _sum }) => ({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        total: _sum.amount || 0,
      })),
    };
  }
  async getGrossProfit(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<number> {
    const totalSales = await this.prismaService.transaction.groupBy({
      by: ['userId'],
      where: {
        category: TransactionCategory.SALE,
        createdAt: {
          gte: startDate || new Date(0),
          lte: endDate || new Date(),
        },
        ...(deliverymanId && { userId: deliverymanId }),
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpenses = await this.prismaService.transaction.groupBy({
      by: ['userId'],
      where: {
        category: TransactionCategory.EXPENSE,
        createdAt: {
          gte: startDate || new Date(0),
          lte: endDate || new Date(),
        },
        ...(deliverymanId && { userId: deliverymanId }),
      },
      _sum: {
        amount: true,
      },
    });

    const salesTotal = totalSales.reduce((acc, sale) => acc + (sale._sum.amount || 0), 0);
    const expensesTotal = totalExpenses.reduce((acc, expense) => acc + (expense._sum.amount || 0), 0);

    const formattedSalesTotal = parseFloat(salesTotal.toFixed(2));
    const formattedExpensesTotal = parseFloat((expensesTotal / 100).toFixed(2));

    const grossProfit = formattedSalesTotal - formattedExpensesTotal;
    const formattedGrossProfit = grossProfit >= 0 ? parseFloat(grossProfit.toFixed(2)) : 0;

    return formattedGrossProfit;
  }
}
