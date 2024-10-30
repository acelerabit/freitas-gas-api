import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { CustomerWithComodatosRepository } from '@/application/repositories/customer-with-comodato-repository';
import { CustomerWithComodato } from '@/application/entities/customers-with-comodato';
import { PrismaCustomerWithComodatosMapper } from '../mappers/customer-with-comodato';

@Injectable()
export class PrismaCustomerWithComodatosRepository implements CustomerWithComodatosRepository {
  constructor(private prismaService: PrismaService) { }


  async create(customerWithcomodato: CustomerWithComodato): Promise<void> {
    await this.prismaService.customerWithComodato.create({
      data: {
        customerId: customerWithcomodato.customerId,
        id: customerWithcomodato.id,
        quantity: customerWithcomodato.quantity
      }
    })
  }

  async findByCustomer(customerId: string): Promise<CustomerWithComodato | null> {
    const raw = await this.prismaService.customerWithComodato.findFirst({
      where: {
        customerId
      }
    })

    if(!raw) {
      return null
    }

    return PrismaCustomerWithComodatosMapper.toDomain(raw)
  }

  async findById(id: string): Promise<CustomerWithComodato | null> {
    throw new Error('Method not implemented.');
  }


  async update(customerWithcomodato: CustomerWithComodato): Promise<void> {
    await this.prismaService.customerWithComodato.update({
      where: {
        id: customerWithcomodato.id,
      },
      data: {
        customerId: customerWithcomodato.customerId,
        quantity: customerWithcomodato.quantity
      }
    })
  }

  async delete(id: string): Promise<void> {
    const result = await this.prismaService.customerWithComodato.delete({
      where: { id },
    });

    if (!result) {
      throw new Error('CustomerWithComodato not found or already deleted');
    }
  }
}
