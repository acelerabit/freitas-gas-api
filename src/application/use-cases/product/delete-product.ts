import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    await this.productRepository.deleteProduct(productId);
  }
}
