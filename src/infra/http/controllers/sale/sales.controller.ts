import { Controller, Post, Body } from '@nestjs/common';
import { RegisterSaleUseCase } from '../../../../application/use-cases/sale/register-sale';
import { Sale } from '../../../../application/entities/sale';
import { Product } from '../../../../application/entities/product';

@Controller('sales')
export class SalesController {
  constructor(private registerSaleUseCase: RegisterSaleUseCase) {}

  @Post()
  async registerSale(@Body() body) {
    const products = body.products.map(
      (product) =>
        new Product(
          product.productId,
          product.name,
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
      body.type,
    );

    await this.registerSaleUseCase.execute(sale);

    return { message: 'Venda registrada com sucesso' };
  }
}
