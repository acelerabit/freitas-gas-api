import { PaginationParams } from '@/@shared/pagination-interface';
import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';

interface FetchSaleRequest {
  deliverymanId: string;
  pagination?: PaginationParams;
}

@Injectable()
export class FetchSalesByDeliverymanUseCase {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute({ deliverymanId, pagination }: FetchSaleRequest) {
    const sales = await this.salesRepository.findAllByDeliveryman(
      deliverymanId,

      pagination,
    );

    return { sales };
  }
}
