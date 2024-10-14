import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DebtsRepository } from '@/application/repositories/debt-repository';
import { Debt } from '@/application/entities/dept';
import { PrismaDebtsMapper } from '../mappers/debts.mapper';

@Injectable()
export class PrismaDebtsRepository implements DebtsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Debt): Promise<Debt> {
    const debtData = PrismaDebtsMapper.toPrisma(data);
    const debt = await this.prismaService.debt.create({ data: debtData });

    return PrismaDebtsMapper.toDomain(debt);
  }

  async update(id: string, data: Partial<Debt>): Promise<Debt | null> {
    const existingDebt = await this.prismaService.debt.findUnique({
      where: { id },
    });

    if (!existingDebt) {
      throw new Error(`Debt with id ${id} not found`);
    }

    const debtData = new Debt(
      {
        ...existingDebt,
        ...data,
        supplierId: data.supplierId || existingDebt.supplierId,
      },
      id,
    );

    const updatedDebt = await this.prismaService.debt.update({
      where: { id },
      data: PrismaDebtsMapper.toPrisma(debtData),
    });

    return PrismaDebtsMapper.toDomain(updatedDebt);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.debt.delete({
      where: { id },
    });
  }
}
