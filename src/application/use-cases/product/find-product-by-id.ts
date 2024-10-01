import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { Product } from '../../entities/product';

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: string): Promise<Product | null> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    return product;
  }
}
