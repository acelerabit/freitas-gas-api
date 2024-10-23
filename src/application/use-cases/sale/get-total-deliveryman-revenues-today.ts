import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@/application/repositories/transaction-repository';
import { SalesRepository } from '@/application/repositories/sales-repository';

interface GetTotalRevenuesDeliverymanTodayRequest {
  deliverymanId: string;
}

@Injectable()
export class GetTotalRevenuesDeliverymanToday {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute({
    deliverymanId,
  }: GetTotalRevenuesDeliverymanTodayRequest): Promise<number> {
    return this.salesRepository.getTotalRevenuesByDeliveryman(deliverymanId);
  }
}
