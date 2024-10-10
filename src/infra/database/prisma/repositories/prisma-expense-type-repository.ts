import { Injectable } from '@nestjs/common';
import { ExpenseType } from 'src/application/entities/expense-type';
import { ExpenseTypesRepository } from 'src/application/repositories/expense-type-repository';
import { PrismaExpenseTypesMapper } from '../mappers/expense-type.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaExpenseTypesRepository implements ExpenseTypesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(expenseType: ExpenseType): Promise<void> {
    const alreadyExist = await this.prismaService.expenseTypes.findFirst({
      where: {
        name: expenseType.name,
      },
    });

    if (alreadyExist) {
      return;
    }

    await this.prismaService.expenseTypes.create({
      data: {
        id: expenseType.id,
        name: expenseType.name,
      },
    });
  }

  async findAllWithoutPaginate(): Promise<ExpenseType[]> {
    const expenseTypes = await this.prismaService.expenseTypes.findMany();

    return expenseTypes.map(PrismaExpenseTypesMapper.toDomain);
  }

  async count(): Promise<number> {
    const count = await this.prismaService.expenseTypes.count();

    return count;
  }
}
