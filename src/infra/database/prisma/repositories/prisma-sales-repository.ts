import { PaymentMethod } from '@prisma/client';
import { SalesRepository } from '../../../../application/repositories/sales-repository';
import { Sale } from '../../../../application/entities/sale';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSalesRepository extends SalesRepository {
  constructor(private prismaService: PrismaService) {
    super();
  }

  async createSale(sale: Sale): Promise<string> {
    const createdSale = await this.prismaService.sales.create({
      data: {
        customerId: sale.customerId,
        paymentMethod: sale.paymentMethod as PaymentMethod,
        total: sale.totalAmount,
        returned: false,
      },
    });
    return createdSale.id;
  }

  async createSalesProducts(
    saleId: string,
    products: { id: string; quantity: number }[],
  ): Promise<void> {
    const salesProducts = products.map((product) => ({
      saleId,
      productId: product.id,
      quantity: product.quantity,
    }));

    await this.prismaService.salesProduct.createMany({
      data: salesProducts,
    });
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    const newStock = product.quantity + quantity;

    if (newStock < 0) {
      throw new Error('Estoque insuficiente');
    }

    await this.prismaService.product.update({
      where: { id: productId },
      data: { quantity: newStock },
    });
  }
}
