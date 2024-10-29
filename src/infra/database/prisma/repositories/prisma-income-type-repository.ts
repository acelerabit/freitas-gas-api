import { Injectable } from '@nestjs/common';
import { PrismaIncomeTypesMapper } from '../mappers/income-type.mapper';
import { PrismaService } from '../prisma.service';
import { IncomeTypesRepository } from '@/application/repositories/income-types-repository';
import { IncomeType } from '@/application/entities/income-types';

@Injectable()
export class PrismaIncomeTypesRepository implements IncomeTypesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(incomeType: IncomeType): Promise<void> {
    const alreadyExist = await this.prismaService.incomeTypes.findFirst({
      where: {
        name: incomeType.name,
      },
    });

    if (alreadyExist) {
      return;
    }

    await this.prismaService.incomeTypes.create({
      data: {
        id: incomeType.id,
        name: incomeType.name,
      },
    });
  }

  async findAllWithoutPaginate(): Promise<IncomeType[]> {
    const incomeTypes = await this.prismaService.incomeTypes.findMany();

    return incomeTypes.map(PrismaIncomeTypesMapper.toDomain);
  }

  async count(): Promise<number> {
    const count = await this.prismaService.incomeTypes.count();

    return count;
  }
}
