import { SalesRepository } from '@/application/repositories/sales-repository';
import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';

interface GetTotalSalesByPaymentMethodRequest {
  startDate: Date;
  endDate: Date;
  deliverymanId?: string;
}

interface GetTotalSalesByPaymentMethodResponse {
  totalsByPaymentMethod: Record<PaymentMethod, string>;
}

@Injectable()
export class GetTotalSalesByPaymentMethodUseCase {
  constructor(private salesRepository: SalesRepository) {}

  async execute({
    startDate,
    endDate,
    deliverymanId,
  }: GetTotalSalesByPaymentMethodRequest): Promise<GetTotalSalesByPaymentMethodResponse> {
    const totalsByPaymentMethod =
      await this.salesRepository.getTotalSalesByPaymentMethod(
        startDate,
        endDate,
        deliverymanId,
      );

    return { totalsByPaymentMethod };
  }
}
