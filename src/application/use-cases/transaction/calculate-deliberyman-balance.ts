import { TransactionRepository } from '@/application/repositories/transaction-repository';
import { Injectable } from '@nestjs/common';

interface CalculateDeliverymanBalanceRequest {
  deliverymanId: string;
}

interface CalculateDeliverymanBalanceResponse {
  finalBalance: number;
}

@Injectable()
export class CalculateDeliverymanBalance {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({
    deliverymanId,
  }: CalculateDeliverymanBalanceRequest): Promise<CalculateDeliverymanBalanceResponse> {
    const finalBalance =
      await this.transactionRepository.calculateDeliverymanBalance(
        deliverymanId,
      );

    return { finalBalance };
  }
}
