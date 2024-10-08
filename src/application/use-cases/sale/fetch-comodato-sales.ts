import { PaginationParams } from '@/@shared/pagination-interface';
import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';

interface FetchSaleRequest {
  pagination?: PaginationParams;
}
@Injectable()
export class FetchComodatoSalesUseCase {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute({ pagination }: FetchSaleRequest) {
    const sales = await this.salesRepository.findAllComodato(pagination);

    return { sales };
  }
}
