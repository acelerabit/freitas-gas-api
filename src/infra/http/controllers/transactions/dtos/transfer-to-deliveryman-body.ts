import { TransactionCategory, TransactionType } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class TransferToDeliverymanBody {
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsNotEmpty()
  category: TransactionCategory;

  @IsNotEmpty()
  customCategory: string;

  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsOptional()
  bankAccountId?: string;

  @IsNotEmpty()
  senderUserId: string;

  @IsNotEmpty()
  amount: number;
}
