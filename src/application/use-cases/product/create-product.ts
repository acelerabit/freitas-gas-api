import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { Product, ProductProps } from '../../entities/product';
import { ProductType, BottleStatus } from '@prisma/client';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: {
    type: ProductType;
    status: BottleStatus;
    price: number;
    quantity: number;
  }): Promise<void> {
    const productProps: ProductProps = {
      type: data.type,
      status: data.status,
      price: data.price * 100,
      quantity: data.quantity,
    };

    const newProduct = new Product(productProps);

    await this.productRepository.createProduct(newProduct);
  }
}
