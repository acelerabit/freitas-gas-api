import { PaginationParams } from '@/@shared/pagination-interface';
import { Collect } from '@/application/entities/collect';
import { CollectsRepository } from '@/application/repositories/collect-repository';
import { Injectable } from '@nestjs/common';

interface FetchAllCollectsRequest {
  pagination: PaginationParams
}

interface FetchAllCollectsResponse {
  collects: Collect[];
}

@Injectable()
export class FetchAllCollects {
  constructor(private collectsRepository: CollectsRepository) {}

  async execute({
    pagination
  }: FetchAllCollectsRequest): Promise<FetchAllCollectsResponse> {
    const collects = await this.collectsRepository.findAll(
      pagination
    );

    return { collects };
  }
}
