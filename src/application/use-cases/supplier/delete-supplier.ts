import { Injectable } from '@nestjs/common';
import { SuppliersRepository } from '@/application/repositories/supplier-repository';

@Injectable()
export class DeleteSupplier {
  constructor(private suppliersRepository: SuppliersRepository) {}

  async execute(id: string): Promise<void> {
    return this.suppliersRepository.delete(id);
  }
}
