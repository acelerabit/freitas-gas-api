import { Debt } from '@/application/entities/dept';
import { Prisma } from '@prisma/client';

export class PrismaDebtsMapper {
  static toDomain(debt: any): Debt {
    return new Debt(
      {
        amount: debt.amount,
        dueDate: debt.dueDate,
        paid: debt.paid,
        createdAt: debt.createdAt,
        updatedAt: debt.updatedAt,
        supplierId: debt.supplierId,
      },
      debt.id,
    );
  }

  static toPrisma(debt: Debt): Prisma.DebtCreateInput {
    return {
      amount: debt.amount,
      dueDate: debt.dueDate,
      paid: debt.paid,
      supplier: debt.supplierId
        ? { connect: { id: debt.supplierId } }
        : undefined,
    };
  }
}
