import { TransactionCategory, TransactionType } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class DepositToCompanyBody {
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsNotEmpty()
  category: TransactionCategory;

  @IsNotEmpty()
  deliverymanId: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  depositDate: Date;

  @IsNotEmpty()
  @IsOptional()
  bankAccountId?: string;

  @IsNotEmpty()
  @IsOptional()
  bank?: string;
}
