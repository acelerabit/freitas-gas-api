import { TransactionCategory, TransactionType } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTransactionBody {
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsNotEmpty()
  @IsOptional()
  mainAccount: boolean;

  @IsNotEmpty()
  category: TransactionCategory;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsOptional()
  customCategory?: string;

  @IsNotEmpty()
  @IsOptional()
  bankAccountId?: string;

  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  amount: number;
}
