import { Injectable } from '@nestjs/common';
import { Sale } from '../../entities/sale';
import { SalesRepository, SortType } from '../../repositories/sales-repository';
import { PaginationParams } from '@/@shared/pagination-interface';

interface FetchSaleRequest {
  customer?: string;
  deliveryman?: string;
  orderByField?: SortType;
  orderDirection?: 'desc' | 'asc';
  filterParams?: {
    saleType: 'EMPTY' | 'FULL' | 'COMODATO';
    startDate: Date;
    endDate: Date;
  };
  pagination?: PaginationParams;
}

@Injectable()
export class FetchSalesUseCase {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute({
    customer,
    deliveryman,
    orderByField,
    orderDirection,
    filterParams,
    pagination,
  }: FetchSaleRequest) {
    const sales = await this.salesRepository.findAll(
      customer,
      deliveryman,
      orderByField,
      orderDirection,
      filterParams,
      pagination,
    );

    return { sales };
  }
}
