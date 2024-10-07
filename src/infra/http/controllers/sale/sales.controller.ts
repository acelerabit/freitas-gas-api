import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/infra/decorators/auth.decorator';
import { RegisterSaleUseCase } from '../../../../application/use-cases/sale/register-sale';
import { Sale } from '../../../../application/entities/sale';
import { Product } from '../../../../application/entities/product';
import { ProductType, BottleStatus } from '@prisma/client';
import { SortType } from '@/application/repositories/sales-repository';
import { FetchSalesUseCase } from '@/application/use-cases/sale/fetch-sales';
import { SalesPresenters } from './presenters/sale.presenter';
import { GetSaleUseCase } from '@/application/use-cases/sale/get-sale';
import { DeleteSaleUseCase } from '@/application/use-cases/sale/delete-sale';
import { UpdateSaleBody } from './dtos/update-sale-body';
import { UpdateSaleUseCase } from '@/application/use-cases/sale/update-sale';

@Controller('sales')
export class SalesController {
  constructor(
    private registerSaleUseCase: RegisterSaleUseCase,
    private fetchSalesUseCase: FetchSalesUseCase,
    private getSaleUseCase: GetSaleUseCase,
    private deleteSaleUseCase: DeleteSaleUseCase,
    private updateSaleUseCase: UpdateSaleUseCase,
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

  @Auth(Role.ADMIN)
  @Put('/:saleId')
  async editSale(
    @Param('saleId') saleId: string,
    @Body()
    body: UpdateSaleBody,
  ) {
    const { customerId, deliverymanId, paymentMethod, products } = body;
    await this.updateSaleUseCase.execute({
      saleId,
      customerId,
      // deliverymanId,
      paymentMethod,
      products,
    });

    return;
  }

  @Get('/:id')
  async GetSale(@Param('id') id: string) {
    const { sale } = await this.getSaleUseCase.execute({
      id,
    });

    return SalesPresenters.toHTTP(sale);
  }

  @Get()
  async fetchSales(
    @Query()
    query: {
      customer?: string;
      deliveryman?: string;
      orderByField?: SortType;
      orderDirection?: 'desc' | 'asc';
      page?: string;
      itemsPerPage?: string;
      saleType?: 'EMPTY' | 'FULL' | 'COMODATO';
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const {
      customer,
      deliveryman,
      orderByField,
      orderDirection,
      page,
      itemsPerPage,
      saleType,
      startDate,
      endDate,
    } = query;
    const { sales } = await this.fetchSalesUseCase.execute({
      customer,
      deliveryman,
      orderByField,
      orderDirection,
      filterParams: {
        saleType,
        startDate,
        endDate,
      },
      pagination: {
        page: Number(page),
        itemsPerPage: Number(itemsPerPage),
      },
    });

    return sales.map(SalesPresenters.toHTTP);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  async deleteSale(@Param('id') saleId: string): Promise<void> {
    await this.deleteSaleUseCase.execute(saleId);
  }
}
