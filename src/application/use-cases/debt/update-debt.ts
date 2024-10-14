import { Injectable } from '@nestjs/common';
import { DebtsRepository } from '@/application/repositories/debt-repository';
import { Debt } from '@/application/entities/dept';

@Injectable()
export class UpdateDebt {
  constructor(private debtsRepository: DebtsRepository) {}

  async execute(id: string, data: Partial<Debt>): Promise<Debt | null> {
    return this.debtsRepository.update(id, data);
  }
}
