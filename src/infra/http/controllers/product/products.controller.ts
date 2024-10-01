import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ListProductsUseCase } from '../../../../application/use-cases/product/find-all-product';
import { GetProductByIdUseCase } from '../../../../application/use-cases/product/find-product-by-id';
import { CreateProductUseCase } from '../../../../application/use-cases/product/create-product';
import { UpdateProductUseCase } from '../../../../application/use-cases/product/update-product';
import { DeleteProductUseCase } from '../../../../application/use-cases/product/delete-product';
import { Product } from '../../../../application/entities/product';
import { ProductType, BottleStatus } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  async listAllProducts(): Promise<Product[]> {
    return await this.listProductsUseCase.execute();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.getProductByIdUseCase.execute(id);
  }

  @Post()
  async createProduct(
    @Body()
    body: {
      id: string;
      type: ProductType;
      status: BottleStatus;
      price: number;
      quantity: number;
    },
  ): Promise<void> {
    const { id, type, status, price, quantity } = body;
    await this.createProductUseCase.execute({
      id,
      type,
      status,
      price,
      quantity,
    });
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      type: ProductType;
      status: BottleStatus;
      price: number;
      quantity: number;
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

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
