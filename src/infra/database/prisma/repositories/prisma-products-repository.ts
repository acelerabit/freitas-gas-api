import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../../../application/repositories/product-repository';
import { Product } from '../../../../application/entities/product';
import { PrismaService } from '../prisma.service';
import { PrismaProductsMapper } from '../mappers/product.mapper';
import { ProductType, BottleStatus } from '@prisma/client';

@Injectable()
export class PrismaProductRepository extends ProductRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany({
      orderBy: [
        {
          type: 'desc',
        },
        {
          status: 'desc',
        },
      ],
    });

    return products.map(PrismaProductsMapper.toDomain);
  }

  async findById(productId: string): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return null;
    }

    return PrismaProductsMapper.toDomain(product);
  }

  async findByTypeAndStatus(
    type: ProductType,
    status: BottleStatus,
  ): Promise<Product | null> {
    const product = await this.prismaService.product.findFirst({
      where: {
        status,
        type,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductsMapper.toDomain(product);
  }

  async createProduct(product: Product): Promise<void> {
    await this.prismaService.product.create({
      data: {
        id: product.id,
        type: product.type,
        status: product.status,
        price: product.price,
        quantity: product.quantity,
      },
    });
  }

  async updateProduct(product: Product): Promise<void> {
    await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        type: product.type,
        status: product.status,
        price: product.price,
        quantity: product.quantity,
      },
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.prismaService.product.delete({
      where: { id: productId },
    });
  }
}
