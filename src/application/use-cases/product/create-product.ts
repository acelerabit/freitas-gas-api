import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { Product, ProductProps } from '../../entities/product';
import { ProductType, BottleStatus } from '@prisma/client';

interface CreateProductUseCaseRequest {
  type: ProductType;
  status: BottleStatus;
  price: number;
  quantity: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    price,
    quantity,
    status,
    type,
  }: CreateProductUseCaseRequest): Promise<void> {
    const productAlreadyExist =
      await this.productRepository.findByTypeAndStatus(type, status);

    if (productAlreadyExist) {
      throw new BadRequestException(
        `Produto com esse tipo e status já existe`,
        {
          cause: new Error(`Produto com esse tipo e status já existe`),
          description: `Produto com esse tipo e status já existe`,
        },
      );
    }

    const newProduct = new Product({
      type: type,
      status: status,
      price: price * 100,
      quantity: quantity,
    });

    await this.productRepository.createProduct(newProduct);
  }
}
