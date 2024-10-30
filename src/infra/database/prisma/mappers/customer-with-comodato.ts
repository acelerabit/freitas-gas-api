import { CustomerWithComodato } from '@/application/entities/customers-with-comodato';
import { Prisma } from '@prisma/client';

export class PrismaCustomerWithComodatosMapper {
  static toDomain(customerwithcomodato: any): CustomerWithComodato {
    return CustomerWithComodato.create(
      {
        customerId: customerwithcomodato.customerId,
        quantity: customerwithcomodato.quantity,

        createdAt: customerwithcomodato.createdAt,
        user: customerwithcomodato.customer ?? null,
      },
      customerwithcomodato.id,
    );
  }

  static toPrisma(customerwithcomodato: CustomerWithComodato): Prisma.CustomerWithComodatoUncheckedCreateInput {
    return {
      id: customerwithcomodato.id,
      customerId: customerwithcomodato.customerId,
      quantity: customerwithcomodato.quantity,
      createdAt: customerwithcomodato.createdAt,
    };
  }
}
