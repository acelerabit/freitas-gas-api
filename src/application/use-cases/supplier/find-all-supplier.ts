import { SuppliersRepository } from '@/application/repositories/supplier-repository';
import { SupplierFindAll } from '@/application/entities/supplierFindAll';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllSuppliers {
  constructor(private suppliersRepository: SuppliersRepository) {}

  async execute(params: PaginationParams): Promise<SupplierFindAll[]> {
    return this.suppliersRepository.findAll(params);
  }
}
