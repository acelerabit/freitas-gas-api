import { ExpenseType } from '@/application/entities/expense-type';
import { ExpenseTypesRepository } from '@/application/repositories/expense-type-repository';
import { Injectable } from '@nestjs/common';

interface FetchExpenseTypesResponse {
  expenseTypes: ExpenseType[];
}

@Injectable()
export class FetchExpenseTypesUseCase {
  constructor(
    private readonly expenseTypesRepository: ExpenseTypesRepository,
  ) {}

  async execute(): Promise<FetchExpenseTypesResponse> {
    const expenseTypes =
      await this.expenseTypesRepository.findAllWithoutPaginate();

    return { expenseTypes };
  }
}
