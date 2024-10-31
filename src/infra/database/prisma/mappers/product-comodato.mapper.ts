import { ProductComodato } from '@/application/entities/product-comodato';
import { Prisma } from '@prisma/client';

export class PrismaProductComodatosMapper {
  static toDomain(productComodato: any): ProductComodato {
    return ProductComodato.create(
      {
        productId: productComodato.productId,
        quantity: productComodato.quantity,

        createdAt: productComodato.createdAt,
      },
      productComodato.id,
    );
  }

  static toPrisma(
    productComodato: ProductComodato,
  ): Prisma.ProductComodatoUncheckedCreateInput {
    return {
      id: productComodato.id,
      productId: productComodato.productId,
      quantity: productComodato.quantity,
      createdAt: productComodato.createdAt,
    };
  }
}
