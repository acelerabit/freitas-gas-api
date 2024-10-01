import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { Customer } from '@/application/entities/customer';

@Injectable()
export class FindAllCustomersWithoutPaginateUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute(): Promise<Customer[]> {
    return this.customersRepository.findAllWithoutPaginate();
  }
}
