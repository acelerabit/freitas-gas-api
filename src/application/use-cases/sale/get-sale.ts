import { Injectable } from '@nestjs/common';
import { Sale } from '../../entities/sale';
import { SalesRepository, SortType } from '../../repositories/sales-repository';
import { PaginationParams } from '@/@shared/pagination-interface';

interface GetSaleRequest {
  id: string;
}

interface GetSaleResponse {
  sale: Sale;
}

@Injectable()
export class GetSaleUseCase {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute({ id }: GetSaleRequest): Promise<GetSaleResponse> {
    const sale = await this.salesRepository.findById(id);

    return { sale };
  }
}
