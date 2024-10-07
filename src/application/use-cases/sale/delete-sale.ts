import { Injectable, NotFoundException } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';

@Injectable()
export class DeleteSaleUseCase {
  constructor(private salesRepository: SalesRepository) {}

  async execute(saleId: string): Promise<void> {
    const sale = await this.salesRepository.findById(saleId);

    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    await this.salesRepository.deleteSale(saleId);
  }
}
