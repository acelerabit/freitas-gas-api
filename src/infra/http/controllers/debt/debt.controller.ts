import { Body, Controller, Post, Patch, Param, Delete } from '@nestjs/common';
import { CreateDebt } from '@/application/use-cases/debt/create-debt';
import { UpdateDebt } from '@/application/use-cases/debt/update-debt';
import { Debt } from '@/application/entities/dept';
import { DeleteDebt } from '@/application/use-cases/debt/delete-debt';

@Controller('debts')
export class DebtController {
  constructor(
    private readonly createDebt: CreateDebt,
    private readonly updateDebt: UpdateDebt,
    private readonly deleteDebt: DeleteDebt,
  ) { }

  @Post()
  async create(
    @Body()
    debtData: {
      supplierId: string;
      amount: number;
      dueDate: string;
      paid: boolean;
    },
  ): Promise<Debt> {
    return this.createDebt.execute(debtData);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() debtData: Partial<Debt>,
  ): Promise<Debt | null> {
    return this.updateDebt.execute(id, debtData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteDebt.execute(id);
  }
}
