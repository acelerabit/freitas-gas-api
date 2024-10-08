import { TransactionRepository } from '../../../../application/repositories/transaction-repository';
import { Transaction } from '../../../../application/entities/transaction';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaTransactionsMapper } from '../mappers/transaction.mapper';
import { PaginationParams } from '@/@shared/pagination-interface';

@Injectable()
export class PrismaTransactionRepository extends TransactionRepository {
  constructor(private prismaService: PrismaService) {
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
    };

    await this.prismaService.transaction.create({
      data: transactionData,
    });
  }

  async findAll(pagination: PaginationParams): Promise<Transaction[]> {
    const transactions = await this.prismaService.transaction.findMany({
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
    });
    return transactions.map(PrismaTransactionsMapper.toDomain);
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
}
