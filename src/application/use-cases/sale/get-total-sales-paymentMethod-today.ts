import { Injectable } from '@nestjs/common';
import { SalesRepository } from '@/application/repositories/sales-repository';
import { PaymentMethod } from '@prisma/client';

interface GetTotalSalesByPaymentMethodForTodayRequest {
  deliverymanId: string;
}

type GetTotalSalesByPaymentMethodForTodayResponse = Record<
  PaymentMethod,
  string
>;

@Injectable()
export class GetTotalSalesByPaymentMethodForTodayUseCase {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute({
    deliverymanId,
  }: GetTotalSalesByPaymentMethodForTodayRequest): Promise<GetTotalSalesByPaymentMethodForTodayResponse> {
    const totalsByPaymentMethod =
      await this.salesRepository.getTotalSalesByPaymentMethodForToday(
        deliverymanId,
      );

    return totalsByPaymentMethod;
  }
}
