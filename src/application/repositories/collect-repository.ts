import { PaginationParams }  from '@/@shared/pagination-interface';
import { Collect } from '../entities/collect';

export abstract class CollectsRepository {
  abstract create(collect: Collect): Promise<void>;
  abstract findByCustomer(customerId: string): Promise<Collect | null>;
  abstract findAll(pagination: PaginationParams): Promise<Collect[]>;
  abstract findAllWithoutPaginate(): Promise<Collect[]>;
  abstract count(): Promise<number>;
  abstract findById(id: string): Promise<Collect | null>;
  abstract update(collect: Collect): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
