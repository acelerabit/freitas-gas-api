import { IsNotEmpty } from "class-validator";



export class CreateBankAccountBody {
  @IsNotEmpty()
  bank: string;

  @IsNotEmpty()
  paymentsAssociated: string[];
}