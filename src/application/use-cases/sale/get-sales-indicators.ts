import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';

@Injectable()
export class GetSalesIndicatorsUseCase {
  private salesRepository: SalesRepository;

  constructor(salesRepository: SalesRepository) {
    this.salesRepository = salesRepository;
  }

  async execute(startDate: Date, endDate: Date, deliverymanId?: string) {
    return this.salesRepository.getSalesIndicators(
      startDate,
      endDate,
      deliverymanId,
    );
  }
}
