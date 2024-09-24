import { PaginationParams } from '@/@shared/pagination-interface';
import { Customer } from '../entities/customer';

export abstract class CustomersRepository {
  abstract create(customer: Customer): Promise<void>;
  abstract findAll(pagination: PaginationParams): Promise<Customer[]>;
  abstract findAllWithoutPaginate(): Promise<Customer[]>;
  abstract count(): Promise<number>;
  abstract findByEmail(email: string): Promise<Customer | null>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract update(customer: Customer): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
