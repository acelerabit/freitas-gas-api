import { Injectable } from '@nestjs/common';
import { SuppliersRepository } from '@/application/repositories/supplier-repository';
import { Supplier } from '@/application/entities/supplier';

@Injectable()
export class UpdateSupplier {
  constructor(private suppliersRepository: SuppliersRepository) {}

  async execute(id: string, data: Partial<Supplier>): Promise<Supplier | null> {
    return this.suppliersRepository.update(id, data);
  }
}
