import { IncomeType } from '../entities/income-types';

export abstract class IncomeTypesRepository {
  abstract create(incomeType: IncomeType): Promise<void>;
  abstract findAllWithoutPaginate(): Promise<IncomeType[]>;
  abstract count(): Promise<number>;
}
