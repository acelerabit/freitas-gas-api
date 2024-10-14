import { Injectable } from '@nestjs/common';
import { DebtsRepository } from '@/application/repositories/debt-repository';
import { Debt } from '@/application/entities/dept';

@Injectable()
export class CreateDebt {
  constructor(private debtsRepository: DebtsRepository) {}

  async execute(data: Debt): Promise<Debt> {
    return this.debtsRepository.create(data);
  }
}
