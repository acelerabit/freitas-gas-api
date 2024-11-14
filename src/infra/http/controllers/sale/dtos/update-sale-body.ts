import { ProductType } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSaleBody {
  @IsOptional()
  @IsNotEmpty()
  products: {
    id: string;
    productId: string;
    type: ProductType;
    status: string;
    price: number;
    salePrice: number;
    quantity: number;
  }[];

  @IsOptional()
  @IsNotEmpty()
  customerId: string;

  @IsOptional()
  @IsNotEmpty()
  deliverymanId: string;

  @IsOptional()
  @IsNotEmpty()
  paymentMethod: string;

  @IsOptional()
  @IsNotEmpty()
  createdAt?: Date;
}
