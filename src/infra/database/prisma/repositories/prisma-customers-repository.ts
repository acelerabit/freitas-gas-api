import { Injectable } from '@nestjs/common';
import { Customer } from 'src/application/entities/customer';
import { CustomersRepository } from '../../../../application/repositories/customer-repository';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { PrismaCustomersMapper } from '../mappers/customer.mapper';

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(customer: Customer): Promise<void> {
    await this.prismaService.customer.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        street: customer.street,
        number: customer.number,
        district: customer.district,
        city: customer.city,
        state: customer.state,
        creditBalance: customer.creditBalance,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const raw = await this.prismaService.customer.findMany({
      where: {
        email: email,
      },
    });

    if (raw.length === 0) {
      return null;
    }

    return PrismaCustomersMapper.toDomain(raw[0]);
  }

  async findAll(pagination: PaginationParams): Promise<Customer[]> {
    const customers = await this.prismaService.customer.findMany({
      take: Number(pagination.itemsPerPage),
      skip: (pagination.page - 1) * Number(pagination.itemsPerPage),
      orderBy: {
        createdAt: 'desc',
      },
    });
    return customers.map(PrismaCustomersMapper.toDomain);
  }

  async findAllWithoutPaginate(): Promise<Customer[]> {
    const customers = await this.prismaService.customer.findMany();

    return customers.map(PrismaCustomersMapper.toDomain);
  }

  async findById(id: string): Promise<Customer | null> {
    const raw = await this.prismaService.customer.findUnique({
      where: {
        id,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaCustomersMapper.toDomain(raw);
  }

  async update(customer: Customer): Promise<void> {
    const existingCustomer = await this.prismaService.customer.findUnique({
      where: { id: customer.id },
    });

    if (!existingCustomer) {
      throw new Error(`Customer with id ${customer.id} not found`);
    }

    const prismaCustomer = PrismaCustomersMapper.toPrisma(customer);

    await this.prismaService.customer.update({
      where: { id: customer.id },
      data: prismaCustomer,
    });
  }

  async count(): Promise<number> {
    const count = await this.prismaService.customer.count();
    return count;
  }

  async delete(id: string): Promise<void> {
    const result = await this.prismaService.customer.delete({
      where: { id },
    });

    if (!result) {
      throw new Error('Customer not found or already deleted');
    }
  }
}
