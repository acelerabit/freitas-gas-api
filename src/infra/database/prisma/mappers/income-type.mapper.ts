import { IncomeType } from 'src/application/entities/income-types';
import { Prisma } from '@prisma/client';

export class PrismaIncomeTypesMapper {
  static toDomain(incomeType: any) {
    return IncomeType.create(
      {
        name: incomeType.name,
      },
      incomeType.id,
    );
  }

  static toPrisma(
    incomeType: IncomeType,
  ): Prisma.IncomeTypesUncheckedCreateInput {
    return {
      name: incomeType.name,

      id: incomeType.id,
    };
  }
}
