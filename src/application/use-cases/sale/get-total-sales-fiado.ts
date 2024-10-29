import { SalesRepository } from '@/application/repositories/sales-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetTotalMoneySalesByPaymentMethodFiado {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<number> {
    const totalMoneySales =
      await this.salesRepository.getTotalMoneySalesByPaymentMethodFiado(
        startDate,
        endDate,
        deliverymanId,
      );
    return totalMoneySales;
  }
}
