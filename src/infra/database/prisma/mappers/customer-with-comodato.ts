import { CustomerWithComodato } from '@/application/entities/customers-with-comodato';
import { Prisma } from '@prisma/client';
import { PrismaProductComodatosMapper } from './product-comodato.mapper';

export class PrismaCustomerWithComodatosMapper {
  static toDomain(customerWithComodato: any): CustomerWithComodato {
    return CustomerWithComodato.create(
      {
        customerId: customerWithComodato.customerId,
        quantity: customerWithComodato.quantity,
        products: customerWithComodato.products.map(
          PrismaProductComodatosMapper.toDomain,
        ),
        createdAt: customerWithComodato.createdAt,
        user: customerWithComodato.customer ?? null,
      },
      customerWithComodato.id,
    );
  }

  static toPrisma(
    customerWithComodato: CustomerWithComodato,
  ): Prisma.CustomerWithComodatoUncheckedCreateInput {
    return {
      id: customerWithComodato.id,
      customerId: customerWithComodato.customerId,
      quantity: customerWithComodato.quantity,
      createdAt: customerWithComodato.createdAt,
    };
  }
}
