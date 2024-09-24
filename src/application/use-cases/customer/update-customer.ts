import { CustomersRepository } from '../../repositories/customer-repository';
import { Customer } from '../../entities/customer';

export class UpdateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(customer: Customer): Promise<void> {
    await this.customersRepository.update(customer);
  }
}
