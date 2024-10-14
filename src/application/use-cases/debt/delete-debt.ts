import { Injectable } from '@nestjs/common';
import { DebtsRepository } from '@/application/repositories/debt-repository';

@Injectable()
export class DeleteDebt {
  constructor(private readonly debtRepository: DebtsRepository) {}

  async execute(id: string): Promise<void> {
    await this.debtRepository.delete(id);
  }
}
