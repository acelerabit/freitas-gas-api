import { IsNotEmpty } from "class-validator";



export class CollectBody {
  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  quantity: number;
}