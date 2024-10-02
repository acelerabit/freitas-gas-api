import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';

@Injectable()
export class DeleteSaleUseCase {
  constructor(private salesRepository: SalesRepository) {}

  async execute(saleId: string): Promise<void> {
    await this.salesRepository.deleteSale(saleId);
  }
}
