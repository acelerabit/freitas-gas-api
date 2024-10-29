import { SalesRepository } from '@/application/repositories/sales-repository';
import { Injectable } from '@nestjs/common';

interface GetTotalMoneySalesDeliverymanTodayRequest {
  deliverymanId: string;
}

@Injectable()
export class GetTotalMoneySalesDeliverymanToday {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute({
    deliverymanId,
  }: GetTotalMoneySalesDeliverymanTodayRequest): Promise<number> {
    return this.salesRepository.getTotalMoneySalesByDeliveryman(deliverymanId);
  }
}
