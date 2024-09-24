import { Customer } from 'src/application/entities/customer';
import { Prisma } from '@prisma/client';

export class PrismaCustomersMapper {
  static toDomain(customer: any): Customer {
    return Customer.create(
      {
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
      customer.id,
    );
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
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
    };
  }
}
