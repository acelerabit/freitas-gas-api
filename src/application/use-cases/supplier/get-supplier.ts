import { Injectable } from '@nestjs/common';
import { SuppliersRepository } from '@/application/repositories/supplier-repository';
import { Supplier } from '@/application/entities/supplier';

@Injectable()
export class GetSupplier {
  constructor(private suppliersRepository: SuppliersRepository) {}

  async execute(id: string): Promise<Supplier | null> {
    return this.suppliersRepository.get(id);
  }
}
