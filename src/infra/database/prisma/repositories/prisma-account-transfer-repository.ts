import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AccountsTransferRepository } from '@/application/repositories/account-transfer';
import { AccountTransfer } from '@/application/entities/account-transfer';
import { PrismaAccountTransfersMapper } from '../mappers/account-transfer';
import { PaginationParams } from '@/@shared/pagination-interface';

@Injectable()
export class PrismaAccountTransfersRepository
  implements AccountsTransferRepository
{
  constructor(private prismaService: PrismaService) {}

  async findAllWithoutPaginate(): Promise<AccountTransfer[]> {
    const accountTransfers = await this.prismaService.accountTransfer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        destinationAccount: true,
        originAccount: true,
      },
    });
    return accountTransfers.map(PrismaAccountTransfersMapper.toDomain);
  }

  async findAll(pagination: PaginationParams): Promise<AccountTransfer[]> {
    if (!pagination.itemsPerPage && !pagination.page) {
      return [];
    }

    const accountTransfers = await this.prismaService.accountTransfer.findMany({
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        destinationAccount: true,
        originAccount: true,
      },
    });
    return accountTransfers.map(PrismaAccountTransfersMapper.toDomain);
  }

  async count(): Promise<number> {
    const count = await this.prismaService.accountTransfer.count();

    return count;
  }

  async create(accountTransfer: AccountTransfer): Promise<void> {
    const toPrisma = PrismaAccountTransfersMapper.toPrisma(accountTransfer);

    await this.prismaService.accountTransfer.create({
      data: {
        ...toPrisma,
      },
    });
  }

  async findById(id: string): Promise<AccountTransfer | null> {
    const result = await this.prismaService.accountTransfer.findUnique({
      where: { id },
      include: {
        destinationAccount: true,
        originAccount: true,
      },
    });

    if (!result) {
      return null;
    }

    return PrismaAccountTransfersMapper.toDomain(result);
  }

  async update(accountTransfer: AccountTransfer): Promise<void> {
    await this.prismaService.accountTransfer.update({
      where: {
        id: accountTransfer.id,
      },
      data: {
        originAccountId: accountTransfer.originAccountId,
        destinationAccountId: accountTransfer.destinationAccountId,
        value: accountTransfer.value,
        type: accountTransfer.type,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const result = await this.prismaService.accountTransfer.delete({
      where: { id },
    });

    if (!result) {
      throw new Error('AccountTransfer not found or already deleted');
    }
  }
}
