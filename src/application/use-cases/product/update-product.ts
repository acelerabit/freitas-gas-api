import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { Product, ProductProps } from '../../entities/product';
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
    const productProps: ProductProps = {
      type: data.type,
      status: data.status,
      price: data.price,
      quantity: data.quantity,
    };

    const updatedProduct = new Product(data.id, productProps);
    await this.productRepository.updateProduct(updatedProduct);
  }
}
