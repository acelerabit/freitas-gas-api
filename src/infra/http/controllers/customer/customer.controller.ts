import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateCustomerUseCase } from '../../../../application/use-cases/customer/create-customer';
import { FindAllCustomersUseCase } from '../../../../application/use-cases/customer/find-all-customers';
import { FindCustomerByIdUseCase } from '../../../../application/use-cases/customer/find-customer-by-id';
import { UpdateCustomerUseCase } from '../../../../application/use-cases/customer/update-customer';
import { DeleteCustomerUseCase } from '../../../../application/use-cases/customer/delete-customer';
import { Customer, CustomerProps } from 'src/application/entities/customer';
import { PaginationParams } from '@/@shared/pagination-interface';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { FindAllCustomersWithoutPaginateUseCase } from '@/application/use-cases/customer/findAllCustomersWithoutPaginate';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findAllCustomersUseCase: FindAllCustomersUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly customersRepository: CustomersRepository,
    private readonly findAllCustomersWithoutPaginateUseCase: FindAllCustomersWithoutPaginateUseCase,
  ) {}

  @Post()
  async create(
    @Body() customerData: Omit<CustomerProps, 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    const customer = Customer.create(customerData);
    await this.createCustomerUseCase.execute(customer);
  }

  @Get()
  async findAll(@Query() pagination: PaginationParams): Promise<Customer[]> {
    return this.findAllCustomersUseCase.execute(pagination);
  }

  @Get('/all')
  async findAllWithoutPaginate(): Promise<Customer[]> {
    return this.findAllCustomersWithoutPaginateUseCase.execute();
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Customer | null> {
    const customer = await FindCustomerByIdUseCase.execute(
      this.customersRepository,
      id,
    );
    return customer;
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() customerData: Partial<Customer>,
  ): Promise<void> {
    const customer = Customer.create({
      ...customerData,
      id: customerData.id || id,
    } as any);
    await this.updateCustomerUseCase.execute(customer);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCustomerUseCase.execute(id);
  }
}
