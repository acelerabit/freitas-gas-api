import { ExpenseType } from 'src/application/entities/expense-type';
import { Prisma } from '@prisma/client';

export class PrismaExpenseTypesMapper {
  static toDomain(expenseType: any) {
    return ExpenseType.create(
      {
        name: expenseType.name,
      },
      expenseType.id,
    );
  }

  static toPrisma(
    expenseType: ExpenseType,
  ): Prisma.ExpenseTypesUncheckedCreateInput {
    return {
      name: expenseType.name,

      id: expenseType.id,
    };
  }
}
