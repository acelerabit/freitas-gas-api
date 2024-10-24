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
import { FetchComodatoSalesUseCase } from '@/application/use-cases/sale/fetch-comodato-sales';
import { GetSalesIndicatorsUseCase } from '@/application/use-cases/sale/get-sales-indicators';
import { GetAverageSalesUseCase } from '@/application/use-cases/sale/get-average-sales';
import { FetchSalesByDeliverymanUseCase } from '@/application/use-cases/sale/fetch-by-deliveryman';
import { GetTotalRevenuesDeliverymanToday } from '@/application/use-cases/sale/get-total-deliveryman-revenues-today';

@Controller('sales')
export class SalesController {
  constructor(
    private registerSaleUseCase: RegisterSaleUseCase,
    private fetchSalesUseCase: FetchSalesUseCase,
    private getSaleUseCase: GetSaleUseCase,
    private deleteSaleUseCase: DeleteSaleUseCase,
    private updateSaleUseCase: UpdateSaleUseCase,
    private fetchComodatoSalesUseCase: FetchComodatoSalesUseCase,
    private getSalesIndicatorsUseCase: GetSalesIndicatorsUseCase,
    private getAverageSalesUseCase: GetAverageSalesUseCase,
    private fetchSalesByDeliverymanUseCase: FetchSalesByDeliverymanUseCase,
    private getTotalRevenuesDeliverymanToday: GetTotalRevenuesDeliverymanToday,
  ) {}

  @Post()
  async registerSale(@Body() body) {
    const products = body.products.map(
      (product) =>
        new Product({
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

  @Get('/list/comodato')
  async fetchComodatoSales(
    @Query()
    query: {
      page?: string;
      itemsPerPage?: string;
    },
  ) {
    const { page, itemsPerPage } = query;
    const { sales } = await this.fetchComodatoSalesUseCase.execute({
      pagination: {
        page: Number(page),
        itemsPerPage: Number(itemsPerPage),
      },
    });

    return sales.map(SalesPresenters.toHTTP);
  }

  @Delete(':id')
  async deleteSale(@Param('id') saleId: string): Promise<void> {
    await this.deleteSaleUseCase.execute(saleId);
  }

  @Get('/indicators')
  async getSalesIndicators(
    @Query()
    query: {
      startDate: string;
      endDate: string;
      deliverymanId?: string;
    },
  ) {
    const { startDate, endDate, deliverymanId } = query;

    const dateFiltersProvided = startDate && endDate;
    const startDateObj = dateFiltersProvided
      ? new Date(startDate)
      : new Date('2000-01-01');
    const endDateObj = dateFiltersProvided ? new Date(endDate) : new Date();

    const indicators = await this.getSalesIndicatorsUseCase.execute(
      startDateObj,
      endDateObj,
      deliverymanId,
    );

    return indicators;
  }

  @Get('/average-sales')
  async getAverageSales(
    @Query()
    query: {
      startDate: string;
      endDate: string;
      deliverymanId?: string;
    },
  ) {
    const { startDate, endDate, deliverymanId } = query;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const averageSales = await this.getAverageSalesUseCase.execute({
      startDate: startDateObj,
      endDate: endDateObj,
      deliverymanId,
    });
    return {
      averageDailySales: averageSales.averageDailySales,
      averageMonthlySales: averageSales.averageMonthlySales,
    };
  }

  @Get('/deliveryman/:id')
  async GetSalesByDeliveryman(
    @Param('id') id: string,
    @Query()
    query: {
      page?: string;
      itemsPerPage?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const { page, itemsPerPage, startDate, endDate } = query;
    const { sales } = await this.fetchSalesByDeliverymanUseCase.execute({
      deliverymanId: id,
      pagination: {
        page: Number(page),
        itemsPerPage: Number(itemsPerPage),
      },
      startDate,
      endDate,
    });

    return sales.map(SalesPresenters.toHTTP);
  }

  @Get('/revenues-total-today/:deliverymanId')
  async revenuesToday(
    @Param('deliverymanId') deliverymanId: string,
  ): Promise<number> {
    return this.getTotalRevenuesDeliverymanToday.execute({
      deliverymanId,
    });
  }

  @Get('/:id')
  async GetSale(@Param('id') id: string) {
    const { sale } = await this.getSaleUseCase.execute({
      id,
    });

    return SalesPresenters.toHTTP(sale);
  }
}
