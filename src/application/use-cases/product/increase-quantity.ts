import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';

interface IncreaseProductQuantityRequest {
  id: string;
  quantity: number;
}

@Injectable()
export class IncreaseProductQuantityUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    id,
    quantity,
  }: IncreaseProductQuantityRequest): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    product.quantity += quantity;

    await this.productRepository.updateProduct(product);
  }
}
