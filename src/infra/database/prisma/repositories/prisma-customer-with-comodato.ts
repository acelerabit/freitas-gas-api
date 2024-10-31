import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { CustomerWithComodatosRepository } from '@/application/repositories/customer-with-comodato-repository';
import { CustomerWithComodato } from '@/application/entities/customers-with-comodato';
import { PrismaCustomerWithComodatosMapper } from '../mappers/customer-with-comodato';
import { Product } from '@/application/entities/product';
import { ProductComodato } from '@/application/entities/product-comodato';
import { PrismaProductComodatosMapper } from '../mappers/product-comodato.mapper';

@Injectable()
export class PrismaCustomerWithComodatosRepository
  implements CustomerWithComodatosRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(customerWithcomodato: CustomerWithComodato): Promise<void> {
    await this.prismaService.customerWithComodato.create({
      data: {
        customerId: customerWithcomodato.customerId,
        id: customerWithcomodato.id,
        quantity: customerWithcomodato.quantity,
      },
    });
  }

  async findByCustomer(
    customerId: string,
  ): Promise<CustomerWithComodato | null> {
    const raw = await this.prismaService.customerWithComodato.findFirst({
      where: {
        customerId,
      },
      include: {
        products: true,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaCustomerWithComodatosMapper.toDomain(raw);
  }

  async findById(id: string): Promise<CustomerWithComodato | null> {
    throw new Error('Method not implemented.');
  }

  async update(customerWithcomodato: CustomerWithComodato): Promise<void> {
    await this.prismaService.customerWithComodato.update({
      where: {
        id: customerWithcomodato.id,
      },
      data: {
        customerId: customerWithcomodato.customerId,
        quantity: customerWithcomodato.quantity,
      },
    });
  }

  async findByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<number> {
    const raw = await this.prismaService.customerWithComodato.findFirst({
      where: {
        customerId,
      },
      include: {
        products: {
          where: {
            productId,
          },
        },
      },
    });

    if (!raw) {
      return null;
    }

    const totalQuantity =
      raw?.products.reduce((sum, product) => sum + product.quantity, 0) || 0;

    return totalQuantity;
  }

  async saveProducts(
    products: Product[],
    customerWithComodatoId: string,
  ): Promise<ProductComodato[]> {
    const productsCreated = await Promise.all(
      products.map(async (product) => {
        return await this.prismaService.productComodato.create({
          data: {
            quantity: product.quantity,
            productId: product.id,
            customerWithComodatoId,
          },
        });
      }),
    );

    return productsCreated.map(PrismaProductComodatosMapper.toDomain);
  }

  async updateProducts(
    products: Product[],
    customerWithComodatoId: string,
  ): Promise<ProductComodato[]> {
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const existingProductComodato =
          await this.prismaService.productComodato.findFirst({
            where: { productId: product.id },
          });

        if (existingProductComodato) {
          return await this.prismaService.productComodato.update({
            where: { id: existingProductComodato.id },
            data: {
              quantity: existingProductComodato.quantity + product.quantity,
            },
          });
        } else {
          return await this.prismaService.productComodato.create({
            data: {
              quantity: product.quantity,
              productId: product.id,
              customerWithComodatoId,
            },
          });
        }
      }),
    );

    return updatedProducts.map(PrismaProductComodatosMapper.toDomain);
  }

  async saveCollectProducts(
    productId: string,
    quantity: number,
    customerWithComodatoId: string,
  ) {
    await this.prismaService.productComodato.updateMany({
      where: {
        productId,
        customerWithComodatoId,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    return;
  }

  async delete(id: string): Promise<void> {
    const result = await this.prismaService.customerWithComodato.delete({
      where: { id },
    });

    if (!result) {
      throw new Error('CustomerWithComodato not found or already deleted');
    }
  }
}
