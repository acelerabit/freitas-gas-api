import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { ProductType, BottleStatus } from '@prisma/client';
import { Product } from '@/application/entities/product';

interface UpdateProductRequest {
  id: string;
  type?: ProductType;
  status?: BottleStatus;
  price?: number;
  quantity?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    id,
    type,
    quantity,
    status,
    price,
  }: UpdateProductRequest): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const updates: Partial<Product> = {};

    if (status) {
      updates.status = status;
    }

    if (price) {
      updates.price = price * 100;
    }

    if (type) {
      updates.type = type;
    }

    if (quantity) {
      updates.quantity = quantity;
    }

    Object.assign(product, updates);

    await this.productRepository.updateProduct(product);
  }
}
