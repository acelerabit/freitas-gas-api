import { Injectable } from '@nestjs/common';
import { DebtsRepository } from '@/application/repositories/debt-repository';
import { Debt } from '@/application/entities/dept';

interface CreateDebitRequest {
  supplierId: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  bankAccountId?: string;
}

@Injectable()
export class CreateDebt {
  constructor(private debtsRepository: DebtsRepository) {}

  async execute({
    supplierId,
    amount,
    dueDate,
    paid,
    bankAccountId,
  }: CreateDebitRequest): Promise<Debt> {
    const newDebt = new Debt({
      amount: amount,
      dueDate: new Date(dueDate),
      paid: paid,
      supplierId: supplierId,
      bankAccountId,
    });

    return this.debtsRepository.create(newDebt);
  }
}
