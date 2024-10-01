import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: string): Promise<void> {
    await this.productRepository.deleteProduct(productId);
  }
}
