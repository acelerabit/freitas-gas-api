import { Supplier } from '../entities/supplier';
import { SupplierFindAll } from '../entities/supplierFindAll';
import { SupplierWithDebts } from '../entities/supplierWithDebts';
import { PaginationParams } from '@/@shared/pagination-interface';

export abstract class SuppliersRepository {
  abstract create(data: Supplier): Promise<Supplier>;
  abstract update(
    id: string,
    data: Partial<Supplier>,
  ): Promise<Supplier | null>;
  abstract delete(id: string): Promise<void>;
  abstract get(id: string): Promise<Supplier | null>;
  abstract findWithDebts(id: string): Promise<SupplierWithDebts | null>;
  abstract findAll(params: PaginationParams): Promise<SupplierFindAll[]>;
}
