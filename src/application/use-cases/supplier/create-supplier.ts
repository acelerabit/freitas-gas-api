import { Injectable } from '@nestjs/common';
import { SuppliersRepository } from '@/application/repositories/supplier-repository';
import { Supplier } from '@/application/entities/supplier';

@Injectable()
export class CreateSupplier {
  constructor(private suppliersRepository: SuppliersRepository) {}

  async execute(data: Supplier): Promise<Supplier> {
    return this.suppliersRepository.create(data);
  }
}
