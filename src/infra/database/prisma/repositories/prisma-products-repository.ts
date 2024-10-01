import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../../../application/repositories/product-repository';
import { Product } from '../../../../application/entities/product';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaProductRepository extends ProductRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany();
    return products.map(
      (product) =>
        new Product(
          product.id,
          product.type,
          product.status,
          product.price,
          product.quantity,
        ),
    );
  }

  async findById(productId: string): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return null;
    }
    return new Product(
      product.id,
      product.type,
      product.status,
      product.price,
      product.quantity,
    );
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
