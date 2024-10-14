import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateSupplier } from '@/application/use-cases/supplier/create-supplier';
import { UpdateSupplier } from '@/application/use-cases/supplier/update-supplier';
import { DeleteSupplier } from '@/application/use-cases/supplier/delete-supplier';
import { GetSupplier } from '@/application/use-cases/supplier/get-supplier';
import { GetSupplierWithDebts } from '@/application/use-cases/supplier/get-supplier-with-debts';
import { Supplier } from '@/application/entities/supplier';
import { SupplierWithDebts } from '@/application/entities/supplierWithDebts';
import { GetAllSuppliers } from '@/application/use-cases/supplier/find-all-supplier';
import { PaginationParams } from '@/@shared/pagination-interface';
import { SupplierFindAll } from '@/application/entities/supplierFindAll';

@Controller('suppliers')
export class SupplierController {
  constructor(
    private readonly createSupplier: CreateSupplier,
    private readonly updateSupplier: UpdateSupplier,
    private readonly deleteSupplier: DeleteSupplier,
    private readonly getSupplier: GetSupplier,
    private readonly getSupplierWithDebts: GetSupplierWithDebts,
    private readonly getAllSuppliers: GetAllSuppliers,
  ) {}

  @Post()
  async create(@Body() supplierData: Supplier): Promise<Supplier> {
    return this.createSupplier.execute(supplierData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() supplierData: Partial<Supplier>,
  ): Promise<Supplier | null> {
    return this.updateSupplier.execute(id, supplierData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteSupplier.execute(id);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Supplier | null> {
    return this.getSupplier.execute(id);
  }

  @Get(':id/debts')
  async getWithDebts(
    @Param('id') id: string,
  ): Promise<SupplierWithDebts | null> {
    return this.getSupplierWithDebts.execute(id);
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationParams,
  ): Promise<SupplierFindAll[]> {
    return this.getAllSuppliers.execute(pagination);
  }
}
