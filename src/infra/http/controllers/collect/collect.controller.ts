import { CollectComodatoUseCase } from '@/application/use-cases/collect/collect-comodato';
import {
  Body,
  Controller,
  Get,
  Post,
  Query
} from '@nestjs/common';
import { CollectBody } from './dtos/collect-body';
import { PaginationParams } from '@/@shared/pagination-interface';
import { FetchAllCollects } from '@/application/use-cases/collect/fetch-collects';
import { CollectsPresenters } from './presenters/collect.presenter';

@Controller('collect')
export class CollectController {
  constructor(
    private collectComodato: CollectComodatoUseCase,
    private fetchAllCollects: FetchAllCollects
  ) {}

  @Post()
  async collect(
    @Body() body: CollectBody,
  ): Promise<void> {
    const {customerId, productId, quantity} = body

    await this.collectComodato.execute({
      customerId,
      productId,
      quantity,
    });
  }

  @Get()
  async findAll(@Query() pagination: PaginationParams) {
    const {collects} = await this.fetchAllCollects.execute({
      pagination
    });


    return collects.map(CollectsPresenters.toHTTP)
  }
  
}
