import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { RegisterSaleUseCase } from '../../../../application/use-cases/sale/register-sale';
import { Sale } from '../../../../application/entities/sale';
import { Product } from '../../../../application/entities/product';
import { ProductType, BottleStatus } from '@prisma/client';
import { DeleteSaleUseCase } from '@/application/use-cases/sale/delete-sale';

@Controller('sales')
export class SalesController {
  constructor(
    private registerSaleUseCase: RegisterSaleUseCase,
    private deleteSaleUseCase: DeleteSaleUseCase
  ) {}

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

  @Delete(':id')
  async deleteSale(@Param('id') saleId: string): Promise<void> {
    await this.deleteSaleUseCase.execute(saleId);
  }
}
