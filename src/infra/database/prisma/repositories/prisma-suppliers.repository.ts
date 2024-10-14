import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SuppliersRepository } from '@/application/repositories/supplier-repository';
import { SupplierWithDebts } from '@/application/entities/supplierWithDebts';
import { Supplier, SupplierProps } from '@/application/entities/supplier';
import { SupplierFindAll } from '@/application/entities/supplierFindAll';
import { PaginationParams } from '@/@shared/pagination-interface';
import { PrismaSuppliersMapper } from '../mappers/supplier.mapper';

@Injectable()
export class PrismaSuppliersRepository implements SuppliersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: SupplierProps): Promise<Supplier> {
    const supplier = await this.prismaService.supplier.create({ data });
    return PrismaSuppliersMapper.toDomain(supplier);
  }

  async update(
    id: string,
    data: Partial<SupplierProps>,
  ): Promise<Supplier | null> {
    const supplier = await this.prismaService.supplier.update({
      where: { id },
      data,
    });

    return PrismaSuppliersMapper.toDomain(supplier);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.debt.deleteMany({
      where: { supplierId: id },
    });

    await this.prismaService.supplier.delete({
      where: { id },
    });
  }

  async get(id: string): Promise<Supplier | null> {
    const supplier = await this.prismaService.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      return null;
    }

    return PrismaSuppliersMapper.toDomain(supplier);
  }

  async findWithDebts(id: string): Promise<SupplierWithDebts | null> {
    const supplier = await this.prismaService.supplier.findUnique({
      where: { id },
      include: {
        debts: true,
      },
    });

    if (!supplier) {
      return null;
    }

    return PrismaSuppliersMapper.toDomainWithDebts(supplier);
  }

  async findAll(pagination: PaginationParams): Promise<SupplierFindAll[]> {
    const suppliers = await this.prismaService.supplier.findMany({
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        debts: true,
      },
    });

    return suppliers.map(PrismaSuppliersMapper.toFindAll);
  }
}
