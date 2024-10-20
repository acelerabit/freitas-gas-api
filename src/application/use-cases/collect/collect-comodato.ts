import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { UsersRepository } from '@/application/repositories/user-repository';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { ProductRepository } from '@/application/repositories/product-repository';

interface CollectComodatoUseCaseProps {
  quantity: number;
  customerId: string;
}

@Injectable()
export class CollectComodatoUseCase {
  constructor(
    private salesRepository: SalesRepository,
    private customerRepository: CustomersRepository,
    private productsRepository: ProductRepository,
  ) {}

  async execute({
    quantity,
    customerId,
  }: CollectComodatoUseCaseProps): Promise<void> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new BadRequestException('Cliente não encontrado', {
        cause: new Error('Cliente não encontrado'),
        description: 'Cliente não encontrado',
      });
    }

    const quantityInComodato =
      await this.salesRepository.findComodatoByCustomer(customerId);

    if (quantityInComodato !== 0 && !quantityInComodato) {
      throw new BadRequestException('Cliente não tem itens em comodato', {
        cause: new Error('Cliente não tem itens em comodato'),
        description: 'Cliente não tem itens em comodato',
      });
    }

    if (quantityInComodato < quantity) {
      throw new BadRequestException(
        'Cliente tem menos itens em comodado do que o solicitado para coleta',
        {
          cause: new Error(
            'Cliente tem menos itens em comodado do que o solicitado para coleta',
          ),
          description:
            'Cliente tem menos itens em comodado do que o solicitado para coleta',
        },
      );
    }

    // await this.productsRepository.collect(quantity);

    // setar algo nos itens em comodato desse cliente como recolhidos
  }
}
