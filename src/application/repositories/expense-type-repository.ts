import { ExpenseType } from '../entities/expense-type';

export abstract class ExpenseTypesRepository {
  abstract create(expenseType: ExpenseType): Promise<void>;
  abstract findAllWithoutPaginate(): Promise<ExpenseType[]>;
  abstract count(): Promise<number>;
}
