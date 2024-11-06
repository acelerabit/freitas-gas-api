import { IsNotEmpty } from "class-validator";



export class UpdateBankAccountBody {
  @IsNotEmpty()
  bank: string;

  @IsNotEmpty()
  paymentsAssociated: string[];
}