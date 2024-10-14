import { Injectable } from '@nestjs/common';
import { SuppliersRepository } from '@/application/repositories/supplier-repository';
import { SupplierWithDebts } from '@/application/entities/supplierWithDebts';

@Injectable()
export class GetSupplierWithDebts {
  constructor(private suppliersRepository: SuppliersRepository) {}

  async execute(id: string): Promise<SupplierWithDebts | null> {
    return this.suppliersRepository.findWithDebts(id);
  }
}
