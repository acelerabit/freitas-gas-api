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
        new Product(product.productId, {
          type: product.type as ProductType,
          status: product.status as BottleStatus,
          price: product.price,
          quantity: product.quantity,
        }),
    );

    const sale = new Sale(body.customerId, {
      deliverymanId: body.deliverymanId,
      products,
      paymentMethod: body.paymentMethod,
      totalAmount: 0,
      type: 'FULL',
    });

    await this.registerSaleUseCase.execute(sale);

    return { message: 'Venda registrada com sucesso' };
  }
}
