import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { Product } from '../../entities/product';
import { ProductType, BottleStatus } from '@prisma/client';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: {
    id: string;
    type: ProductType;
    status: BottleStatus;
    price: number;
    quantity: number;
  }): Promise<void> {
    const newProduct = new Product(
      data.id,
      data.type,
      data.status,
      data.price,
      data.quantity,
    );
    await this.productRepository.createProduct(newProduct);
  }
}
