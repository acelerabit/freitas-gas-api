import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '../../repositories/customer-repository';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Customer } from '../../entities/customer';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(pagination: PaginationParams): Promise<Customer[]> {
    return this.customersRepository.findAll(pagination);
  }
}
