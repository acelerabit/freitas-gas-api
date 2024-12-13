import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { PaginationParams } from '@/@shared/pagination-interface';

interface MarkAllAsPaidRequest {
  customerId: string;
  bankAccountId: string;
}

@Injectable()
export class MarkAllAsPaid {
  constructor(private salesRepository: SalesRepository) {}

  async execute({
    customerId,
    bankAccountId,
  }: MarkAllAsPaidRequest): Promise<void> {
    this.salesRepository.markAllAsPaid(customerId, bankAccountId);
    return;
  }
}
