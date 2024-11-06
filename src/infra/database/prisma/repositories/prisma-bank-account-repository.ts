import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { PrismaBankAccountsMapper } from '../mappers/bank-account';
import { BankAccountsRepository } from '@/application/repositories/bank-repositry';
import { BankAccount } from '@/application/entities/bank-account';

@Injectable()
export class PrismaBankAccountsRepository implements BankAccountsRepository {
  constructor(private prismaService: PrismaService) { }
  


  async findAllWithoutPaginate(): Promise<BankAccount[]> {
    const bankAccounts = await this.prismaService.bankAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return bankAccounts.map(PrismaBankAccountsMapper.toDomain);
  }

  async count(): Promise<number> {
    const count = await this.prismaService.bankAccount.count();

    return count;
  }


  async create(bankAccount: BankAccount): Promise<void> {
    await this.prismaService.bankAccount.create({
      data: {
        paymentsAssociated: bankAccount.paymentsAssociated,
        id: bankAccount.id,
        bank: bankAccount.bank,
        createdAt: bankAccount.createdAt
      }
    })
  }

  async alreadyGotThisPaymentMethods(paymentMethods: string[], bankId?: string): Promise<boolean> {
    const whereCondition = {
      paymentsAssociated: {
        hasSome: paymentMethods,
      },
      ...(bankId ? { id: { not: bankId } } : {}),
    };
  
    const exists = await this.prismaService.bankAccount.findFirst({
      where: whereCondition,
    });
  
    return !!exists;
  }
  

  async findById(id: string): Promise<BankAccount | null> {
    throw new Error('Method not implemented.');
  }


  async update(bankAccount: BankAccount): Promise<void> {
    await this.prismaService.bankAccount.update({
      where: {
        id: bankAccount.id,
      },
      data: {
        bank: bankAccount.bank,
        paymentsAssociated: bankAccount.paymentsAssociated
      }
    })
  }

  async delete(id: string): Promise<void> {
    const result = await this.prismaService.bankAccount.delete({
      where: { id },
    });

    if (!result) {
      throw new Error('BankAccount not found or already deleted');
    }
  }
}
