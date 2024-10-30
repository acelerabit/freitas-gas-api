import { PaginationParams } from '@/@shared/pagination-interface';
import { CustomerWithComodato } from '../entities/customers-with-comodato';

export abstract class CustomerWithComodatosRepository {
  abstract create(customerwithcomodato: CustomerWithComodato): Promise<void>;
  abstract findByCustomer(customerId: string): Promise<CustomerWithComodato | null>;
  abstract findById(id: string): Promise<CustomerWithComodato | null>;
  abstract update(customerwithcomodato: CustomerWithComodato): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
