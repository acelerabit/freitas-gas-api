import { PaginationParams } from '@/@shared/pagination-interface';
import { CustomerWithComodato } from '../entities/customers-with-comodato';
import { Product } from '../entities/product';
import { ProductComodato } from '../entities/product-comodato';

export abstract class CustomerWithComodatosRepository {
  abstract create(customerwithcomodato: CustomerWithComodato): Promise<void>;
  abstract findByCustomer(
    customerId: string,
  ): Promise<CustomerWithComodato | null>;
  abstract findById(id: string): Promise<CustomerWithComodato | null>;
  abstract update(customerwithcomodato: CustomerWithComodato): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract saveCollectProducts(
    productId: string,
    quantity: number,
    customerWithComodatoId: string,
  );
  abstract findByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<number>;
  abstract saveProducts(
    products: Product[],
    customerWithComodatoId: string,
  ): Promise<ProductComodato[]>;
  abstract updateProducts(
    products: Product[],
    customerWithComodatoId: string,
  ): Promise<ProductComodato[]>;
}
