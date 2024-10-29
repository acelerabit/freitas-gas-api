import { IncomeType } from '@/application/entities/income-types';
import { IncomeTypesRepository } from '@/application/repositories/income-types-repository';
import { Injectable } from '@nestjs/common';

interface FetchIncomeTypesResponse {
  incomeTypes: IncomeType[];
}

@Injectable()
export class FetchIncomeTypesUseCase {
  constructor(private readonly incomeTypesRepository: IncomeTypesRepository) {}

  async execute(): Promise<FetchIncomeTypesResponse> {
    const incomeTypes =
      await this.incomeTypesRepository.findAllWithoutPaginate();

    return { incomeTypes };
  }
}
