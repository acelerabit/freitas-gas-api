import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { PaginationParams } from '@/@shared/pagination-interface';

interface GetCustomersWithPositiveFiadoDebtsByCustomerRequest {
  customerId: string;
  pagination: PaginationParams;
}

@Injectable()
export class GetCustomersWithPositiveFiadoDebtsByCustomer {
  constructor(private salesRepository: SalesRepository) {}

  async execute({
    customerId,
    pagination,
  }: GetCustomersWithPositiveFiadoDebtsByCustomerRequest): Promise<
    { customerId: string; customerName: string; totalDebt: number }[]
  > {
    return this.salesRepository.getCustomersWithPositiveFiadoDebtsByCustomer(
      customerId,
      pagination,
    );
  }
}
