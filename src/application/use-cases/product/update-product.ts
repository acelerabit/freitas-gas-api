import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { Product } from '../../entities/product';
import { ProductType, BottleStatus } from '@prisma/client';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: {
    id: string;
    type: ProductType;
    status: BottleStatus;
    price: number;
    quantity: number;
  }): Promise<void> {
    const updatedProduct = new Product(
      data.id,
      data.type,
      data.status,
      data.price,
      data.quantity,
    );
    await this.productRepository.updateProduct(updatedProduct);
  }
}
