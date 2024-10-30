import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { UsersRepository } from '@/application/repositories/user-repository';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { ProductRepository } from '@/application/repositories/product-repository';
import { CustomerWithComodatosRepository } from '@/application/repositories/customer-with-comodato-repository';
import { CollectsRepository } from '../../repositories/collect-repository';
import { Collect } from '../../entities/collect';

interface CollectComodatoUseCaseProps {
  quantity: number;
  customerId: string;
  productId: string;
}

@Injectable()
export class CollectComodatoUseCase {
  constructor(
    private salesRepository: SalesRepository,
    private customerRepository: CustomersRepository,
    private customerWithComodatoRepository: CustomerWithComodatosRepository,
    private productRepository: ProductRepository,
    private collectRepository: CollectsRepository
  ) {}

  async execute({
    quantity,
    customerId,
    productId
  }: CollectComodatoUseCaseProps): Promise<void> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new BadRequestException('Cliente não encontrado', {
        cause: new Error('Cliente não encontrado'),
        description: 'Cliente não encontrado',
      });
    }

    const customerWithComodato =
      await this.customerWithComodatoRepository.findByCustomer(customerId);


 
    if (!customerWithComodato) {
      throw new BadRequestException('Cliente não tem itens suficientes em comodato', {
        cause: new Error('Cliente não tem itens em comodato'),
        description: 'Cliente não tem itens em comodato',
      });
    }

    if (customerWithComodato.quantity < quantity) {
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

    

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    customerWithComodato.quantity -= quantity

    await this.customerWithComodatoRepository.update(customerWithComodato)

    product.quantity += quantity;

    await this.productRepository.updateProduct(product);


    const collect = Collect.create({
      customerId: customer.id,
      quantity: quantity,
    })

    await this.collectRepository.create(collect)

    return
  }
}
