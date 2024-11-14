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
import { CustomerWithComodatosRepository } from '@/application/repositories/customer-with-comodato-repository';
import { CustomerWithComodato } from '@/application/entities/customers-with-comodato';
import { BankAccountsRepository } from '@/application/repositories/bank-repositry';

@Injectable()
export class RegisterSaleUseCase {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly customerRepository: CustomersRepository,
    private readonly usersRepository: UsersRepository,
    private productRepository: ProductRepository,
    private customerWithComodatoRepository: CustomerWithComodatosRepository,
    private bankRepository: BankAccountsRepository,
  ) {}

  async execute(sale: Sale): Promise<void> {
    const customer = await this.customerRepository.findById(sale.customerId);

    if (!customer) {
      throw new BadRequestException('Cliente não encontrado', {
        cause: new Error('Cliente não encontrado'),
        description: 'Cliente não encontrado',
      });
    }

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

    const bankAccountToThisPayment =
      await this.bankRepository.accountToThisPaymentMethod(sale.paymentMethod);

    const transaction = new Transaction({
      amount: saleWithCustomerId.totalAmount,
      transactionType: TransactionType.EXIT,
      mainAccount: false,
      category: TransactionCategory.SALE,
      userId: saleWithCustomerId.deliverymanId,
      referenceId: saleId,
      bankAccountId: bankAccountToThisPayment?.id ?? null,
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

    const hasComodato = saleWithCustomerId.products.some(
      (product) => product.status === 'COMODATO',
    );

    if (hasComodato) {
      const comodatoQuantity = saleWithCustomerId.products
        .filter((product) => product.status === 'COMODATO')
        .reduce((acc, product) => acc + product.quantity, 0);

      const comodatoProducts = saleWithCustomerId.products.filter(
        (product) => product.status === 'COMODATO',
      );

      const clientHasComodato =
        await this.customerWithComodatoRepository.findByCustomer(customer.id);

      if (!clientHasComodato) {
        const customerWithComodato = CustomerWithComodato.create({
          customerId: customer.id,
          quantity: comodatoQuantity,
        });

        await this.customerWithComodatoRepository.create(customerWithComodato);

        await this.customerWithComodatoRepository.saveProducts(
          comodatoProducts,
          customerWithComodato.id,
        );
      } else {
        clientHasComodato.quantity += comodatoQuantity;

        // se ele ja tem atualizar a quantidade, se não criar o prosuctComodato
        await this.customerWithComodatoRepository.updateProducts(
          comodatoProducts,
          clientHasComodato.id,
        );

        await this.customerWithComodatoRepository.update(clientHasComodato);
      }
    }
  }

  private generateComodatoTerm(sale: Sale): void {
    console.log(`Gerar termo de comodato para o cliente ${sale.customerId}`);
  }

  private saveComodatos(products: Product[]) {}
}
