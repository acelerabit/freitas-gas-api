import { Controller, Post, Body } from '@nestjs/common';
import { RegisterSaleUseCase } from '../../../../application/use-cases/sale/register-sale';
import { Sale } from '../../../../application/entities/sale';
import { Product } from '../../../../application/entities/product';
import { ProductType, BottleStatus } from '@prisma/client';

@Controller('sales')
export class SalesController {
  constructor(private registerSaleUseCase: RegisterSaleUseCase) {}

  @Post()
  async registerSale(@Body() body) {
    const products = body.products.map(
      (product) =>
        new Product(
          product.productId,
          product.type as ProductType,
          product.status as BottleStatus,
          product.price,
          product.quantity,
        ),
    );

    const sale = new Sale(
      body.customerId,
      body.deliverymanId,
      products,
      body.paymentMethod,
      0,
      'FULL',
    );

    await this.registerSaleUseCase.execute(sale);

    return { message: 'Venda registrada com sucesso' };
  }
}
