import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';

interface TransferProductQuantityRequest {
  productFrom: string;
  productTo: string;
  quantity: number;
}

@Injectable()
export class TransferProductQuantityUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    productFrom,
    productTo,
    quantity,
  }: TransferProductQuantityRequest): Promise<void> {
    const productFromExist = await this.productRepository.findById(productFrom);

    if (!productFromExist) {
      throw new NotFoundException('Produto não encontrado');
    }

    const productToExist = await this.productRepository.findById(productTo);

    if (!productToExist) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (productFromExist.quantity < quantity) {
      throw new BadRequestException(
        `O produto tem menos em estoque do que a quantidade de solicitação de transferência`,
        {
          cause: new Error(
            `O produto tem menos em estoque do que a quantidade de solicitação de transferência`,
          ),
          description: `O produto tem menos em estoque do que a quantidade de solicitação de transferência`,
        },
      );
    }

    if (productFrom === productTo) {
      throw new BadRequestException(
        `Não é possivel tranferir itens para o mesmo produto`,
        {
          cause: new Error(
            `Não é possivel tranferir itens para o mesmo produto`,
          ),
          description: `Não é possivel tranferir itens para o mesmo produto`,
        },
      );
    }

    productFromExist.quantity -= quantity;
    productToExist.quantity += quantity;

    await this.productRepository.updateProduct(productFromExist);
    await this.productRepository.updateProduct(productToExist);
  }
}
