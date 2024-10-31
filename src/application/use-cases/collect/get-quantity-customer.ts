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

interface GetQuantityByCustomerProps {
  customerId: string;
  productId: string;
}

interface GetQuantityByCustomerResponse {
  comodatoQuantity: number;
}

@Injectable()
export class GetQuantityByCustomer {
  constructor(
    private customerRepository: CustomersRepository,
    private customerWithComodatoRepository: CustomerWithComodatosRepository,
  ) {}

  async execute({
    customerId,
    productId,
  }: GetQuantityByCustomerProps): Promise<GetQuantityByCustomerResponse> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new BadRequestException('Cliente não encontrado', {
        cause: new Error('Cliente não encontrado'),
        description: 'Cliente não encontrado',
      });
    }

    const comodatoQuantity =
      await this.customerWithComodatoRepository.findByCustomerAndProduct(
        customerId,
        productId,
      );

    if (!comodatoQuantity) {
      throw new BadRequestException(
        'Cliente não tem itens desse tipo suficientes em comodato',
        {
          cause: new Error('Cliente não tem itens desse tipo em comodato'),
          description: 'Cliente não tem itens desse tipo em comodato',
        },
      );
    }

    return { comodatoQuantity };
  }
}
