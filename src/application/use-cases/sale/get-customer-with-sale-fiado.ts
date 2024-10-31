import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { PaginationParams } from '@/@shared/pagination-interface';

@Injectable()
export class GetCustomersWithPositiveFiadoDebts {
  constructor(private salesRepository: SalesRepository) {}

  async execute(
    pagination: PaginationParams,
  ): Promise<
    { customerId: string; customerName: string; totalDebt: number }[]
  > {
    return this.salesRepository.getCustomersWithPositiveFiadoDebts(pagination);
  }
}
