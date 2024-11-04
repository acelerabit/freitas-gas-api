import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { CollectsRepository } from '@/application/repositories/collect-repository';
import { Collect } from '@/application/entities/collect';
import { PrismaCollectsMapper } from '../mappers/collect';

@Injectable()
export class PrismaCollectsRepository implements CollectsRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll(pagination: PaginationParams): Promise<Collect[]> {
    const collects = await this.prismaService.collect.findMany({
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
      },
    });
    return collects.map(PrismaCollectsMapper.toDomain);
  }

  async findAllWithoutPaginate(): Promise<Collect[]> {
    const collects = await this.prismaService.collect.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return collects.map(PrismaCollectsMapper.toDomain);
  }

  async count(): Promise<number> {
    const count = await this.prismaService.collect.count();

    return count;
  }

  async create(collect: Collect): Promise<void> {
    await this.prismaService.collect.create({
      data: {
        customerId: collect.customerId,
        id: collect.id,
        quantity: collect.quantity,
        createdAt: collect.createdAt,
      },
    });
  }

  async findByCustomer(customerId: string): Promise<Collect | null> {
    const raw = await this.prismaService.collect.findFirst({
      where: {
        customerId,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaCollectsMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Collect | null> {
    throw new Error('Method not implemented.');
  }

  async update(collect: Collect): Promise<void> {
    await this.prismaService.collect.update({
      where: {
        id: collect.id,
      },
      data: {
        customerId: collect.customerId,
        quantity: collect.quantity,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const result = await this.prismaService.collect.delete({
      where: { id },
    });

    if (!result) {
      throw new Error('Collect not found or already deleted');
    }
  }
}
