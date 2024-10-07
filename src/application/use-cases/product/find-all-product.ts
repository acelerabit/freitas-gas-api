import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { Product } from '../../entities/product';

interface ListProductsUseCaseResponse {
  products: Product[];
}

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<ListProductsUseCaseResponse> {
    const products = await this.productRepository.findAll();

    return {
      products,
    };
  }
}
