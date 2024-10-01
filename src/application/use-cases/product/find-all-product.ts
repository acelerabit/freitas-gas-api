import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { Product } from '../../entities/product';

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}
