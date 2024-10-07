import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';

interface DecreaseProductQuantityRequest {
  id: string;
  quantity: number;
}

@Injectable()
export class DecreaseProductQuantityUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    id,
    quantity,
  }: DecreaseProductQuantityRequest): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.quantity <= 0) {
      throw new BadRequestException('Produto já está sem estoque');
    }

    product.quantity -= quantity;

    await this.productRepository.updateProduct(product);
  }
}
