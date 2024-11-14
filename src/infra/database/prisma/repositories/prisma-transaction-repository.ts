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
      bankAccountId: transaction.bankAccountId,
      category: transaction.category,
      userId: transaction.userId,
      referenceId: transaction.referenceId ?? null,
      createdAt: transaction.createdAt,
      customCategory: transaction.customCategory ?? null,
      description: transaction.description,
      depositDate: transaction.depositDate,
      senderUserId: transaction.senderUserId,
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
          category: {
            not: 'DEPOSIT',
          },
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
        category: {
          not: 'DEPOSIT',
        },
        ...whereFilter,
      },
      orderBy: orderBy,
    });

    return raw.map(PrismaTransactionsMapper.toDomain);
  }

  async findAllWithoutPaginate(): Promise<Transaction[]> {
    const transactions = await this.prismaService.transaction.findMany();
    return transactions.map(PrismaTransactionsMapper.toDomain);
  }

  async findAllExpenses(
    pagination: PaginationParams,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Transaction[]> {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        category: 'EXPENSE',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
    });
    return transactions.map(PrismaTransactionsMapper.toDomain);
  }

  async findAllDepositsByDeliveryman(
    deliverymanId: string,
    pagination: PaginationParams,
  ): Promise<Transaction[]> {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        AND: [
          {
            category: 'DEPOSIT',
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

  async findAllDepositsByDeliverymanYesterday(
    deliverymanId: string,
  ): Promise<Transaction[]> {
    const { startOfYesterday, endOfYesterday } =
      await this.dateService.startAndEndOfYesterday();

    const transactions = await this.prismaService.transaction.findMany({
      where: {
        AND: [
          {
            category: 'DEPOSIT',
          },
          {
            userId: deliverymanId,
          },
        ],
        createdAt: {
          gte: startOfYesterday,
          lt: endOfYesterday,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map(PrismaTransactionsMapper.toDomain);
  }

  async findAllDeposits(
    pagination: PaginationParams,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Transaction[]> {
    const whereCondition: any = { category: 'DEPOSIT' };

    // Ajustando o filtro de data se startDate for fornecido
    if (startDate) {
      whereCondition.createdAt = {
        gte: startDate, // "greater than or equal to" (maior ou igual)
      };
    }

    // Ajustando o filtro de data se endDate for fornecido
    if (endDate) {
      // Ajustando a data final para o final do dia (23:59:59)
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59);

      if (whereCondition.createdAt) {
        whereCondition.createdAt.lte = adjustedEndDate;
      } else {
        whereCondition.createdAt = { lte: adjustedEndDate };
      }
    }

    const transactions = await this.prismaService.transaction.findMany({
      where: whereCondition,
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
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
    const { startOfDay, endOfDay } = this.dateService.startAndEndOfTheDay();

    const total = await this.prismaService.transaction.aggregate({
      _sum: {
        amount: true,
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
        bankAccountId: null,
        category: {
          in: ['DEPOSIT', 'SALE', 'INCOME', 'EXPENSE', 'WITHDRAW', 'TRANSFER'],
        },
      },
    });

    const incomeTotal = transactionsSummary
      .filter((t) => ['DEPOSIT', 'INCOME'].includes(t.category))
      .reduce((acc, curr) => acc + (curr._sum.amount || 0), 0);

    const saleTransactions = await this.prismaService.transaction.findMany({
      where: {
        bankAccountId: null,
        category: 'SALE',
        sales: {
          some: {
            paymentMethod: {
              not: {
                in: ['DINHEIRO', 'FIADO'],
              },
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

    const expenseTransactions = await this.prismaService.transaction.findMany({
      where: {
        bankAccountId: null,
        category: { in: ['EXPENSE', 'WITHDRAW', 'TRANSFER'] },
        OR: [
          {
            category: { in: ['EXPENSE', 'WITHDRAW'] },
            user: {
              role: 'ADMIN',
            },
          },
          {
            category: 'TRANSFER',
            senderUser: {
              role: 'ADMIN',
            },
          },
        ],
      },
      select: { amount: true },
    });

    const expenseTotal = expenseTransactions.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    const finalBalance = incomeTotal + saleTotal - expenseTotal;

    return finalBalance;
  }

  async calculateAccountsBalance(): Promise<
    { bank: string; balance: number }[]
  > {
    const bankAccounts = await this.prismaService.bankAccount.findMany({
      select: {
        id: true,
        bank: true,
      },
    });

    const result = [];

    for (const bankAccount of bankAccounts) {
      // Calcular o total de receitas ('DEPOSIT' e 'INCOME')
      const incomeTotal = await this.prismaService.transaction.groupBy({
        by: ['category'],
        _sum: { amount: true },
        where: {
          bankAccountId: bankAccount.id,
          category: { in: ['DEPOSIT', 'INCOME'] },
        },
      });

      const totalIncome = incomeTotal.reduce(
        (acc, curr) => acc + (curr._sum.amount || 0),
        0,
      );

      // Calcular o total de vendas ('SALE') excluindo 'DINHEIRO' e 'FIADO'
      const saleTransactions = await this.prismaService.transaction.findMany({
        where: {
          bankAccountId: bankAccount.id,
          category: 'SALE',
          sales: {
            some: {
              OR: [
                {
                  paymentMethod: { not: 'DINHEIRO' }, // Excluir 'DINHEIRO'
                },
                {
                  paymentMethod: 'FIADO', // Incluir 'FIADO'
                  paid: true, // Somente quando 'paid' for true
                },
              ],
            },
          },
        },
        select: { amount: true },
      });

      const saleTotal = saleTransactions.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );

      // Calcular o total de despesas ('EXPENSE', 'WITHDRAW', 'TRANSFER') para usuários 'ADMIN'
      const expenseTransactions = await this.prismaService.transaction.findMany(
        {
          where: {
            bankAccountId: bankAccount.id,
            category: { in: ['EXPENSE', 'WITHDRAW', 'TRANSFER'] },
            OR: [
              {
                category: { in: ['EXPENSE', 'WITHDRAW'] },
                user: {
                  role: 'ADMIN',
                },
              },
              {
                category: 'TRANSFER',
                senderUser: {
                  role: 'ADMIN',
                },
              },
            ],
          },
          select: { amount: true },
        },
      );

      const expenseTotal = expenseTransactions.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );

      // Calcular transferências de saída (originAccountId)
      const outgoingTransfers =
        await this.prismaService.accountTransfer.findMany({
          where: { originAccountId: bankAccount.id },
          select: { value: true },
        });

      const outgoingTotal = outgoingTransfers.reduce(
        (acc, curr) => acc + curr.value,
        0,
      );

      // Calcular transferências de entrada (destinationAccountId)
      const incomingTransfers =
        await this.prismaService.accountTransfer.findMany({
          where: { destinationAccountId: bankAccount.id },
          select: { value: true },
        });

      const incomingTotal = incomingTransfers.reduce(
        (acc, curr) => acc + curr.value,
        0,
      );

      const debtTotal = await this.prismaService.debt.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          bankAccountId: bankAccount.id,
          paid: true, // Somente dívidas pagas
        },
      });

      const totalDebt = debtTotal._sum.amount || 0;

      // Calcular o saldo final
      const balance =
        totalIncome +
        saleTotal +
        incomingTotal -
        expenseTotal -
        outgoingTotal -
        totalDebt;

      // Adicionar o resultado no array
      result.push({
        bank: bankAccount.bank,
        balance,
      });
    }

    return result;
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
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);
    const whereFilter: any = {
      createdAt: {
        gte: startDate,
        lte: adjustedEndDate,
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
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);
    const whereFilter: any = {
      category: TransactionCategory.EXPENSE,
      ...(deliverymanId ? { userId: deliverymanId } : {}),
    };

    if (startDate && endDate) {
      whereFilter.createdAt = {
        gte: startDate,
        lte: adjustedEndDate,
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
          ? Number(((expense._sum.amount / totalAmount) * 100) / 100)
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
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);

    const salesFilter = {
      createdAt: {
        gte: startDate,
        lte: adjustedEndDate,
      },
      ...(deliverymanId && { userId: deliverymanId }),
    };

    const totalSalesAggregate = await this.prismaService.sales.aggregate({
      _sum: {
        total: true,
      },
      where: salesFilter,
    });

    const salesTransactions = await this.prismaService.sales.findMany({
      where: salesFilter,
      select: {
        createdAt: true,
        total: true,
      },
    });

    const salesByMonth = salesTransactions.reduce((acc, sale) => {
      const year = sale.createdAt.getFullYear();
      const month = sale.createdAt.getMonth() + 1;
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = { year, month, total: 0 };
      }

      acc[key].total += sale.total / 100 || 0;
      return acc;
    }, {} as Record<string, { year: number; month: number; total: number }>);

    const totalSalesByMonth = Object.values(salesByMonth);

    const expenseFilter = {
      category: TransactionCategory.EXPENSE,
      createdAt: {
        gte: startDate,
        lte: adjustedEndDate,
      },
      ...(deliverymanId && { userId: deliverymanId }),
    };

    const expenseTransactions = await this.prismaService.transaction.findMany({
      where: expenseFilter,
      select: {
        createdAt: true,
        amount: true,
      },
    });

    const expensesByMonth = expenseTransactions.reduce((acc, transaction) => {
      const year = transaction.createdAt.getFullYear();
      const month = transaction.createdAt.getMonth() + 1;
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = { year, month, total: 0 };
      }
      acc[key].total += transaction.amount / 100 || 0;

      return acc;
    }, {} as Record<string, { year: number; month: number; total: number }>);

    const totalExpensesByMonth = Object.values(expensesByMonth);

    return {
      totalSales: totalSalesByMonth,
      totalExpenses: totalExpensesByMonth,
    };
  }

  async getGrossProfit(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<number> {
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);
    const totalSales = await this.prismaService.transaction.groupBy({
      by: ['userId'],
      where: {
        category: TransactionCategory.SALE,
        createdAt: {
          gte: startDate || new Date(0),
          lte: adjustedEndDate || new Date(),
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
          lte: adjustedEndDate || new Date(),
        },
        ...(deliverymanId && { userId: deliverymanId }),
      },
      _sum: {
        amount: true,
      },
    });

    const salesTotal = totalSales.reduce(
      (acc, sale) => acc + (sale._sum.amount || 0),
      0,
    );
    const expensesTotal = totalExpenses.reduce(
      (acc, expense) => acc + (expense._sum.amount || 0),
      0,
    );

    const formattedSalesTotal = parseFloat((salesTotal / 100).toFixed(2));
    const formattedExpensesTotal = parseFloat((expensesTotal / 100).toFixed(2));

    const grossProfit = formattedSalesTotal - formattedExpensesTotal;
    const formattedGrossProfit = parseFloat(grossProfit.toFixed(2));

    return formattedGrossProfit;
  }
}
