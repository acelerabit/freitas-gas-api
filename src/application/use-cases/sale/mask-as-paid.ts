import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { PaginationParams } from '@/@shared/pagination-interface';

interface MarkAsPaidRequest {
  id: string;
  bankAccountId: string;
}

@Injectable()
export class MarkAsPaid {
  constructor(private salesRepository: SalesRepository) {}

  async execute({ id, bankAccountId }: MarkAsPaidRequest): Promise<void> {
    this.salesRepository.markAsPaid(id, bankAccountId);
    return;
  }
}
