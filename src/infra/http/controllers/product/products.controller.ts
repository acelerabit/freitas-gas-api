import { TransferProductQuantityUseCase } from './../../../../application/use-cases/product/transfer-quantity-product';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/infra/decorators/auth.decorator';
import { ListProductsUseCase } from '../../../../application/use-cases/product/find-all-product';
import { GetProductByIdUseCase } from '../../../../application/use-cases/product/find-product-by-id';
import { CreateProductUseCase } from '../../../../application/use-cases/product/create-product';
import { UpdateProductUseCase } from '../../../../application/use-cases/product/update-product';
import { DeleteProductUseCase } from '../../../../application/use-cases/product/delete-product';
import { Product } from '../../../../application/entities/product';
import { ProductType, BottleStatus } from '@prisma/client';
import { ProductsPresenters } from './presenters/product.presenter';
import { DecreaseProductQuantityUseCase } from '@/application/use-cases/product/decrease-quantity';
import { IncreaseProductQuantityUseCase } from '@/application/use-cases/product/increase-quantity';

@Controller('products')
export class ProductController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly decreaseProductQuantityUseCase: DecreaseProductQuantityUseCase,
    private readonly increaseProductQuantityUseCase: IncreaseProductQuantityUseCase,
    private readonly transferProductQuantityUseCase: TransferProductQuantityUseCase,
  ) {}

  @Auth(Role.ADMIN, Role.DELIVERYMAN)
  @Get()
  async listAllProducts(): Promise<Product[]> {
    const { products } = await this.listProductsUseCase.execute();

    return products;
  }

  @Auth(Role.ADMIN, Role.DELIVERYMAN)
  @Get('/list')
  async list() {
    const { products } = await this.listProductsUseCase.execute();

    return products.map(ProductsPresenters.toHTTP);
  }

  @Auth(Role.ADMIN, Role.DELIVERYMAN)
  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.getProductByIdUseCase.execute(id);
  }

  @Auth(Role.ADMIN)
  @Post()
  async createProduct(
    @Body()
    body: {
      type: ProductType;
      status: BottleStatus;
      price: number;
      quantity: number;
    },
  ): Promise<void> {
    const { type, status, price, quantity } = body;
    await this.createProductUseCase.execute({
      type,
      status,
      price,
      quantity,
    });
  }

  @Auth(Role.ADMIN)
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      type?: ProductType;
      status?: BottleStatus;
      price?: number;
      quantity?: number;
    },
  ): Promise<void> {
    const { type, status, price, quantity } = body;
    await this.updateProductUseCase.execute({
      id,
      type,
      status,
      price,
      quantity,
    });
  }

  @Auth(Role.ADMIN)
  @Patch('/:id/increase')
  async increase(
    @Param('id') id: string,
    @Body()
    body: {
      quantity: number;
    },
  ): Promise<void> {
    const { quantity } = body;
    await this.increaseProductQuantityUseCase.execute({
      id,
      quantity,
    });
  }

  @Auth(Role.ADMIN)
  @Patch('/:id/decrease')
  async decrease(
    @Param('id') id: string,
    @Body()
    body: {
      quantity: number;
    },
  ): Promise<void> {
    const { quantity } = body;
    await this.decreaseProductQuantityUseCase.execute({
      id,
      quantity,
    });
  }

  @Auth(Role.ADMIN)
  @Patch('/productFrom/:productFrom/productTo/:productTo')
  async transfer(
    @Param('productFrom') productFrom: string,
    @Param('productTo') productTo: string,

    @Body()
    body: {
      quantity: number;
    },
  ) {
    const { quantity } = body;
    await this.transferProductQuantityUseCase.execute({
      productFrom,
      productTo,
      quantity,
    });
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
