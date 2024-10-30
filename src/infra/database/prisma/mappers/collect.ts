import { Collect } from '@/application/entities/collect';
import { Prisma } from '@prisma/client';

export class PrismaCollectsMapper {
  static toDomain(collect: any): Collect {
    return Collect.create(
      {
        customerId: collect.customerId,
        quantity: collect.quantity,

        createdAt: collect.createdAt,
        customer: collect.customer ?? null,
      },
      collect.id,
    );
  }

  static toPrisma(collect: Collect): Prisma.CollectUncheckedCreateInput {
    return {
      id: collect.id,
      customerId: collect.customerId,
      quantity: collect.quantity,
      createdAt: collect.createdAt,
    };
  }
}
