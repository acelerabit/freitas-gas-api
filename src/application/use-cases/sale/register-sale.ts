import { BadRequestException, Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { Sale } from '../../entities/sale';
import { Transaction } from '../../entities/transaction';
import { TransactionType, TransactionCategory } from '@prisma/client';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { BottleStatus } from '@prisma/client';
import { UsersRepository } from '@/application/repositories/user-repository';
import { ProductRepository } from '@/application/repositories/product-repository';
import { Product } from '@/application/entities/product';

@Injectable()
export class RegisterSaleUseCase {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly customerRepository: CustomersRepository,
    private readonly usersRepository: UsersRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(sale: Sale): Promise<void> {
    const customer = await this.customerRepository.findById(sale.customerId);
    const isComodato = sale.products.some(
      (product) => product.status === BottleStatus.COMODATO,
    );

    if (isComodato && customer.name === 'Cliente Genérico') {
      throw new BadRequestException(
        'Não é permitido utilizar o cliente "Cliente Genérico" para vendas em comodato.',
        {
          cause: new Error(
            'Não é permitido utilizar o cliente "Cliente Genérico" para vendas em comodato.',
          ),
          description:
            'Não é permitido utilizar o cliente "Cliente Genérico" para vendas em comodato.',
        },
      );
    }

    const deliveryman = await this.usersRepository.findById(sale.deliverymanId);

    if (!deliveryman) {
      throw new BadRequestException('Entregador não encontrado', {
        cause: new Error('Entregador não encontrado'),
        description: 'Entregador não encontrado',
      });
    }

    const formatProducts = await Promise.all(
      sale.products.map(async (product) => {
        const getProduct = await this.productRepository.findByTypeAndStatus(
          product.type,
          product.status,
        );

        if (getProduct) {
          return new Product(
            {
              price: product.price * 100,
              quantity: product.quantity,
              status: product.status,
              type: product.type,
            },
            getProduct.id,
          );
        }

        return null; // Retorne null para valores não encontrados
      }),
    );

    const saleWithCustomerId = new Sale(sale.customerId, {
      deliverymanId: sale.deliverymanId,
      paymentMethod: sale.paymentMethod,
      products: formatProducts.filter((product) => product !== null),
      totalAmount: sale.totalAmount,
      type: sale.type,
      customer: customer,
      deliveryman: deliveryman,
    });

    for (const product of saleWithCustomerId.products) {
      await this.salesRepository.updateStock(
        product.id,
        product.quantity,
        product.status,
      );
    }

    saleWithCustomerId.calculateTotal();

    const saleId = await this.salesRepository.createSale(saleWithCustomerId);

    const saleProducts = saleWithCustomerId.products.map((product) => ({
      id: product.id,
      salePrice: product.price,
      typeSale: product.status,
      quantity: product.quantity,
    }));

    await this.salesRepository.createSalesProducts(saleId, saleProducts);

    const transaction = new Transaction({
      amount: saleWithCustomerId.totalAmount,
      transactionType: TransactionType.EXIT,
      mainAccount: false,
      category: TransactionCategory.SALE,
      userId: saleWithCustomerId.deliverymanId,
      referenceId: saleId,
    });

    await this.transactionRepository.createTransaction(transaction);

    saleWithCustomerId.transactionId = transaction.id;
    saleWithCustomerId.deliverymanId = transaction.userId;

    await this.salesRepository.update(saleWithCustomerId);

    if (saleWithCustomerId.paymentMethod === 'FIADO') {
      customer.creditBalance += saleWithCustomerId.totalAmount;
      await this.customerRepository.update(customer);
    }

    if (saleWithCustomerId.isComodato()) {
      this.generateComodatoTerm(saleWithCustomerId);
    }
  }

  private generateComodatoTerm(sale: Sale): void {
    console.log(`Gerar termo de comodato para o cliente ${sale.customerId}`);
  }
}
