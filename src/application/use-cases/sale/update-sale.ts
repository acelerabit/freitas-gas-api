import { Product } from '@/application/entities/product';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { UsersRepository } from '@/application/repositories/user-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BottleStatus, ProductType } from '@prisma/client';
import { Sale } from '../../entities/sale';
import { SalesRepository } from '../../repositories/sales-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';

interface UpdateSaleUseCaseProps {
  saleId: string;
  deliverymanId?: string;
  customerId?: string;
  products?: {
    id: string;
    productId: string;
    price: number;
    salePrice: number;
    quantity: number;
    type: ProductType;
    status: string;
  }[];
  paymentMethod?: string;
  totalAmount?: number;
  type?: string;
  createdAt?: Date;
}

@Injectable()
export class UpdateSaleUseCase {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly customerRepository: CustomersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    saleId,
    customerId,
    deliverymanId,
    paymentMethod,
    products,
    type,
    createdAt,
  }: UpdateSaleUseCaseProps): Promise<void> {
    const customer = await this.customerRepository.findById(customerId);
    const isComodato = products.some(
      (product) => product.status === BottleStatus.COMODATO,
    );
    if (isComodato && customer.name === 'Cliente Genérico') {
      throw new Error(
        'Não é permitido utilizar o cliente "Cliente Genérico" para vendas em comodato.',
      );
    }
    const deliveryman = await this.usersRepository.findById(deliverymanId);
    if (!deliveryman) {
      throw new Error('Entregador não encontrado');
    }

    const sale = await this.salesRepository.findById(saleId);

    if (!sale) {
      throw new BadRequestException('Não foi possivel editar a venda', {
        cause: new Error('Venda não encontrada'),
        description: 'Venda não encontrada',
      });
    }

    const productsFormatted = products.map(
      (product) =>
        new Product(
          {
            type: product.type as ProductType,
            status: product.status as BottleStatus,
            price: product.price * 100,
            salePrice: product.salePrice * 100,
            quantity: product.quantity,
          },
          product.productId,
        ),
    );

    const updates: Partial<Sale> = {};
    if (customerId) {
      updates.customerId = customerId;
    }
    if (deliverymanId) {
      updates.deliverymanId = deliverymanId;
    }
    if (customer) {
      updates.customer = customer;
    }
    if (deliveryman) {
      updates.deliveryman = deliveryman;
    }
    if (products) {
      updates.products = productsFormatted;
    }
    if (paymentMethod) {
      updates.paymentMethod = paymentMethod;
    }
    if (type) {
      updates.type = type;
    }

    if (createdAt) {
      updates.createdAt = createdAt;
    }

    Object.assign(sale, updates);

    sale.calculateTotalUpdate();

    await this.salesRepository.update(sale);

    for (const product of sale.products) {
      await this.salesRepository.updateStock(
        product.id,
        product.quantity,
        product.status,
      );
    }

    const saleProducts = sale.products.map((product) => ({
      id: product.id,
      typeSale: product.status,
      quantity: product.quantity,
      salePrice: product.salePrice,
    }));

    await this.salesRepository.updateSalesProducts(saleId, saleProducts);

    const transaction = await this.transactionRepository.findById(
      sale.transactionId,
    );

    transaction.userId = sale.deliverymanId;

    await this.transactionRepository.update(transaction);

    if (sale.isComodato()) {
      this.generateComodatoTerm(sale);
    }
  }

  private generateComodatoTerm(sale: Sale): void {
    console.log(`Gerar termo de comodato para o cliente ${sale.customerId}`);
  }
}
