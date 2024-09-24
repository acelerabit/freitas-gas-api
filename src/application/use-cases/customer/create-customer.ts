import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '../../repositories/customer-repository';
import { Customer } from '../../entities/customer';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute(customer: Customer): Promise<void> {
    await this.customersRepository.create(customer);
  }
}
