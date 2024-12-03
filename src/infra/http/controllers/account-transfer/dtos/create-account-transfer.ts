import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountTransferBody {
  @IsNotEmpty()
  @IsOptional()
  originAccountId: string;

  @IsNotEmpty()
  @IsOptional()
  destinationAccountId: string;

  @IsNotEmpty()
  value: number;
}