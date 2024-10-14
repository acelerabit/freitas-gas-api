import { Debt } from '../entities/dept';

export abstract class DebtsRepository {
  abstract create(data: Debt): Promise<Debt>;
  abstract update(id: string, data: Partial<Debt>): Promise<Debt | null>;
  abstract delete(id: string): Promise<void>;
}
