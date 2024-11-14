import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { PaginationParams } from '@/@shared/pagination-interface';

interface MarkAsPaidRequest {
  id: string;
}

@Injectable()
export class MarkAsPaid {
  constructor(private salesRepository: SalesRepository) {}

  async execute({ id }: MarkAsPaidRequest): Promise<void> {
    this.salesRepository.markAsPaid(id);
    return;
  }
}
