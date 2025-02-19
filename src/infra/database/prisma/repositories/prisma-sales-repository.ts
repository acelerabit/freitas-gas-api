import { PrismaSalesMapper } from './../mappers/sale.mapper';
import {
  BottleStatus,
  PaymentMethod,
  TransactionCategory,
  TransactionType,
} from '@prisma/client';
import {
  SalesRepository,
  SortType,
} from '../../../../application/repositories/sales-repository';
import { Sale } from '../../../../application/entities/sale';
import {
  BadRequestException,
  Injectable,
  applyDecorators,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { DateService } from '@/infra/dates/date.service';
import { fCurrencyIntlBRL } from '@/utils/formatCurrency';
import { TransactionRepository } from '@/application/repositories/transaction-repository';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { UsersRepository } from '@/application/repositories/user-repository';
import { ProductRepository } from '@/application/repositories/product-repository';
import { CustomerWithComodatosRepository } from '@/application/repositories/customer-with-comodato-repository';
import { BankAccountsRepository } from '@/application/repositories/bank-repositry';
import { Product } from '@/application/entities/product';
import { Customer } from '@/application/entities/customer';
import { User } from '@/application/entities/user';
import { Transaction } from '@/application/entities/transaction';
import { CustomerWithComodato } from '@/application/entities/customers-with-comodato';

@Injectable()
export class PrismaSalesRepository extends SalesRepository {
  constructor(
    private prismaService: PrismaService,
    private dateService: DateService,
    private readonly transactionRepository: TransactionRepository,
    private readonly customerRepository: CustomersRepository,
    private productRepository: ProductRepository,
    private customerWithComodatoRepository: CustomerWithComodatosRepository,
    private bankRepository: BankAccountsRepository,
  ) {
    super();
  }

  async createSale(sale: Sale): Promise<string> {
    const createdSale = await this.prismaService.sales.create({
      data: {
        id: sale.id,
        customerId: sale.customerId,
        paymentMethod: sale.paymentMethod as PaymentMethod,
        total: sale.totalAmount,
        returned: false,
        transactionId: sale.transactionId,
      },
    });
    return createdSale.id;
  }

  async saveSale(sale: Sale, customer: Customer, deliveryman: User) {
    await this.prismaService.$transaction(async (prisma) => {
      const formatProducts = await Promise.all(
        sale.products.map(async (product) => {
          const getProduct = await this.productRepository.findByTypeAndStatus(
            product.type,
            product.status,
          );

          if (getProduct) {
            return new Product(
              {
                price: Math.round(product.price * 100),
                quantity: product.quantity,
                status: product.status,
                type: product.type,
              },
              getProduct.id,
            );
          }

          return null;
        }),
      );

      const saleWithCustomerId = new Sale(
        sale.customerId,
        {
          deliverymanId: sale.deliverymanId,
          paymentMethod: sale.paymentMethod,
          products: formatProducts.filter((product) => product !== null),
          totalAmount: sale.totalAmount,
          type: sale.type,
          customer: customer,
          deliveryman: deliveryman,
        },
        sale.id,
      );

      for (const product of saleWithCustomerId.products) {
        await this.updateStock(product.id, product.quantity, product.status);
      }

      saleWithCustomerId.calculateTotal();

      // const saleId = await this.createSale(saleWithCustomerId);

      const createdSale = await prisma.sales.create({
        data: {
          id: saleWithCustomerId.id,
          customerId: saleWithCustomerId.customerId,
          paymentMethod: saleWithCustomerId.paymentMethod as PaymentMethod,
          total: saleWithCustomerId.totalAmount,
          returned: false,
          transactionId: saleWithCustomerId.transactionId,
          paid: saleWithCustomerId.paymentMethod === 'FIADO' ? false : true,
        },
      });

      const saleId = createdSale.id;

      const saleProducts = saleWithCustomerId.products.map((product) => ({
        id: product.id,
        salePrice: product.price,
        typeSale: product.status,
        quantity: product.quantity,
      }));

      // await this.createSalesProducts(saleId, saleProducts);

      const salesProducts = saleProducts.map((product) => ({
        saleId,
        salePrice: product.salePrice,
        typeSale: product.typeSale,
        productId: product.id,
        quantity: product.quantity,
      }));

      await prisma.salesProduct.createMany({
        data: salesProducts,
      });

      const bankAccountToThisPayment =
        await this.bankRepository.accountToThisPaymentMethod(
          sale.paymentMethod,
        );

      if (
        !bankAccountToThisPayment &&
        sale.paymentMethod !== 'DINHEIRO' &&
        sale.paymentMethod !== 'FIADO'
      ) {
        throw new BadRequestException(
          'Não há conta associada a esse tipo de método de pagamento',
          {
            cause: new Error(
              'Não há conta associada a esse tipo de método de pagamento',
            ),
            description:
              'Não há conta associada a esse tipo de método de pagamento',
          },
        );
      }

      if (
        !bankAccountToThisPayment &&
        sale.paymentMethod === 'DINHEIRO' &&
        deliveryman.role === 'ADMIN'
      ) {
        throw new BadRequestException(
          'Não há conta associada a esse tipo de método de pagamento',
          {
            cause: new Error(
              'Não há conta associada a esse tipo de método de pagamento',
            ),
            description:
              'Não há conta associada a esse tipo de método de pagamento',
          },
        );
      }

      const transaction = new Transaction({
        amount: saleWithCustomerId.totalAmount,
        transactionType: TransactionType.EXIT,
        mainAccount: false,
        category: TransactionCategory.SALE,
        userId: saleWithCustomerId.deliverymanId,
        referenceId: saleId,
        bankAccountId: bankAccountToThisPayment?.id ?? null,
      });

      //  const transactionCreated = await this.transactionRepository.createTransaction(transaction);

      const transactionData = {
        id: transaction.id,
        amount: transaction.amount,
        transactionType: transaction.transactionType,
        bankAccountId: transaction.bankAccountId,
        category: transaction.category,
        userId: transaction.userId,
        referenceId: transaction.referenceId ?? null,
        createdAt: transaction.createdAt,
        customCategory: transaction.customCategory ?? null,
        description: transaction.description,
        depositDate: transaction.depositDate,
        senderUserId: transaction.senderUserId,
        bank: transaction.bank,
      };

      const transactionCreated = await prisma.transaction.create({
        data: transactionData,
      });

      saleWithCustomerId.transactionId = transactionCreated.id;
      saleWithCustomerId.deliverymanId = transactionCreated.userId;

      const response = await prisma.sales.update({
        where: {
          id: createdSale.id,
        },
        data: {
          transactionId: transactionCreated.id,
        },
        include: {
          transaction: {
            include: {
              user: true,
            },
          },
          customer: true,
          products: {
            include: {
              product: true,
              sale: true,
            },
          },
        },
      });

      const formatted = PrismaSalesMapper.toDomain(response);

      // await this.update(formatted);

      const dbSale = await prisma.sales.findUnique({
        where: {
          id: sale.id,
        },
      });

      if (dbSale.paymentMethod !== formatted.paymentMethod) {
        const toPrisma = PrismaSalesMapper.toPrisma(formatted);

        await prisma.sales.update({
          where: {
            id: sale.id,
          },
          data: {
            ...toPrisma,
          },
        });

        const result = await prisma.bankAccount.findFirst({
          where: {
            paymentsAssociated: {
              hasSome: formatted.paymentMethod,
            },
          },
        });

        if (!result) {
          return null;
        }

        await prisma.transaction.update({
          where: {
            id: formatted.transactionId,
          },
          data: {
            createdAt: formatted.createdAt,
            bankAccountId: result.id,
            bank: result.bank,
          },
        });

        return;
      }

      const toPrisma = PrismaSalesMapper.toPrisma(formatted);

      await prisma.sales.update({
        where: {
          id: formatted.id,
        },
        data: {
          ...toPrisma,
        },
      });

      await prisma.transaction.update({
        where: {
          id: formatted.transactionId,
        },
        data: {
          createdAt: formatted.createdAt,
        },
      });

      if (saleWithCustomerId.paymentMethod === 'FIADO') {
        customer.creditBalance += saleWithCustomerId.totalAmount;
        await this.customerRepository.update(customer);
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

          await this.customerWithComodatoRepository.create(
            customerWithComodato,
          );

          await this.customerWithComodatoRepository.saveProducts(
            comodatoProducts,
            customerWithComodato.id,
          );
        } else {
          clientHasComodato.quantity += comodatoQuantity;

          await this.customerWithComodatoRepository.updateProducts(
            comodatoProducts,
            clientHasComodato.id,
          );

          await this.customerWithComodatoRepository.update(clientHasComodato);
        }
      }
    });
  }

  async createSalesProducts(
    saleId: string,
    products: {
      id: string;
      quantity: number;
      typeSale: BottleStatus;
      salePrice: number;
    }[],
  ): Promise<void> {
    const salesProducts = products.map((product) => ({
      saleId,
      salePrice: product.salePrice,
      typeSale: product.typeSale,
      productId: product.id,
      quantity: product.quantity,
    }));

    await this.prismaService.salesProduct.createMany({
      data: salesProducts,
    });
  }

  async updateSalesProducts(
    saleId: string,
    products: {
      id: string;
      quantity: number;
      typeSale: BottleStatus;
      salePrice: number;
    }[],
  ): Promise<void> {
    const salesProducts = products.map((product) => ({
      saleId,
      productId: product.id,
      typeSale: product.typeSale,
      quantity: product.quantity,
      salePrice: product.salePrice,
    }));

    await this.prismaService.salesProduct.deleteMany({
      where: {
        saleId,
      },
    });

    await this.prismaService.salesProduct.createMany({
      data: salesProducts,
    });
  }

  async updateStockOperations(
    productId: string,
    quantity: number,
    status: BottleStatus,
    operation: 'add' | 'remove',
    customerId: string,
  ): Promise<void> {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado', {
        cause: new Error('Produto não encontrado'),
        description: 'Produto não encontrado',
      });
    }

    // Se o status for 'FULL'
    if (status === 'FULL') {
      const newStock =
        operation === 'add'
          ? product.quantity + quantity
          : product.quantity - quantity;

      if (newStock < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      await this.prismaService.product.update({
        where: { id: productId },
        data: { quantity: newStock },
      });

      return;
    }

    // Se o status for 'EMPTY' ou 'COMODATO'
    if (status === 'EMPTY' || status === 'COMODATO') {
      const productFull = await this.prismaService.product.findFirst({
        where: {
          type: product.type,
          status: 'FULL',
        },
      });

      if (!productFull) {
        throw new BadRequestException('Produto cheio não encontrado', {
          cause: new Error('Produto cheio não encontrado'),
          description: 'Produto cheio não encontrado',
        });
      }

      // Ajustando os estoques
      const newStockFull =
        operation === 'add'
          ? productFull.quantity - quantity
          : productFull.quantity + quantity;

      if (newStockFull < 0) {
        throw new BadRequestException(
          'Estoque de bujão cheio insuficiente para realizar a operação',
          {
            cause: new Error('Estoque cheio insuficiente'),
            description: 'Estoque cheio insuficiente',
          },
        );
      }

      const newStock =
        operation === 'add'
          ? product.quantity + quantity
          : product.quantity - quantity;

      if (newStock < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      await this.prismaService.product.update({
        where: { id: productFull.id },
        data: { quantity: newStockFull },
      });

      await this.prismaService.product.update({
        where: { id: productId },
        data: { quantity: newStock },
      });

      if (status === 'COMODATO') {
        if (operation === 'add') {
          this.addComodato(customerId, quantity, status, productId);
        }

        if (operation === 'remove') {
          this.revertComodato(customerId, quantity, status, productId);
        }
      }

      return;
    }

    throw new BadRequestException('Status de produto inválido', {
      cause: new Error('Status inválido'),
      description: 'Status fornecido não é válido',
    });
  }

  // async revertStock(
  //   productId: string,
  //   quantity: number,
  //   status: BottleStatus,
  // ): Promise<void> {
  //   const product = await this.prismaService.product.findUnique({
  //     where: { id: productId },
  //   });

  //   if (!product) {
  //     throw new BadRequestException('Produto não encontrado', {
  //       cause: new Error('Produto não encontrado'),
  //       description: 'Produto não encontrado',
  //     });
  //   }

  //   if (status === 'FULL') {
  //     const revertedStock = product.quantity + quantity;

  //     await this.prismaService.product.update({
  //       where: { id: productId },
  //       data: { quantity: revertedStock },
  //     });

  //     return;
  //   }

  //   if (status === 'EMPTY') {
  //     const productFull = await this.prismaService.product.findFirst({
  //       where: {
  //         type: product.type,
  //         status: 'FULL',
  //       },
  //     });

  //     if (!productFull) {
  //       throw new BadRequestException('Produto cheio não encontrado', {
  //         cause: new Error('Produto cheio não encontrado'),
  //         description: 'Produto cheio não encontrado',
  //       });
  //     }

  //     const revertedStockFull = productFull.quantity + quantity;
  //     const revertedStockEmpty = product.quantity - quantity;

  //     if (revertedStockEmpty < 0) {
  //       throw new BadRequestException('Estoque insuficiente para reverter', {
  //         cause: new Error('Estoque insuficiente para reverter'),
  //         description: 'Estoque insuficiente para reverter',
  //       });
  //     }

  //     await this.prismaService.product.update({
  //       where: { id: productFull.id },
  //       data: { quantity: revertedStockFull },
  //     });

  //     await this.prismaService.product.update({
  //       where: { id: productId },
  //       data: { quantity: revertedStockEmpty },
  //     });

  //     return;
  //   }

  //   if (status === 'COMODATO') {
  //     const productFull = await this.prismaService.product.findFirst({
  //       where: {
  //         type: product.type,
  //         status: 'FULL',
  //       },
  //     });

  //     if (!productFull) {
  //       throw new BadRequestException('Produto cheio não encontrado', {
  //         cause: new Error('Produto cheio não encontrado'),
  //         description: 'Produto cheio não encontrado',
  //       });
  //     }

  //     const revertedStockFull = productFull.quantity + quantity;
  //     const revertedStockComodato = product.quantity - quantity;

  //     if (revertedStockComodato < 0) {
  //       throw new BadRequestException('Estoque insuficiente para reverter', {
  //         cause: new Error('Estoque insuficiente para reverter'),
  //         description: 'Estoque insuficiente para reverter',
  //       });
  //     }

  //     await this.prismaService.product.update({
  //       where: { id: productFull.id },
  //       data: { quantity: revertedStockFull },
  //     });

  //     await this.prismaService.product.update({
  //       where: { id: productId },
  //       data: { quantity: revertedStockComodato },
  //     });

  //     return;
  //   }
  // } // GPT

  async updateStock(
    productId: string,
    quantity: number,
    status: BottleStatus,
  ): Promise<void> {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado', {
        cause: new Error('Produto não encontrado'),
        description: 'Produto não encontrado',
      });
    }

    if (status === 'FULL') {
      const newStock = product.quantity - quantity;

      if (newStock < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      await this.prismaService.product.update({
        where: { id: productId },
        data: { quantity: newStock },
      });

      return;
    }

    if (status === 'EMPTY') {
      const productFull = await this.prismaService.product.findFirst({
        where: {
          type: product.type,
          status: 'FULL',
        },
      });

      const newStockFull = productFull.quantity - quantity;

      if (newStockFull < 0) {
        throw new BadRequestException(
          'Estoque de bujão cheio insuficiente para fazer a troca',
          {
            cause: new Error(
              'Estoque de bujão cheio insuficiente para fazer a troca',
            ),
            description:
              'Estoque de bujão cheio insuficiente para fazer a troca',
          },
        );
      }

      const newStock = product.quantity + quantity;

      if (newStock < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      await this.prismaService.product.update({
        where: { id: productFull.id },
        data: { quantity: newStockFull },
      });

      await this.prismaService.product.update({
        where: { id: productId },
        data: { quantity: newStock },
      });

      return;
    }

    if (status === 'COMODATO') {
      const productFull = await this.prismaService.product.findFirst({
        where: {
          type: product.type,
          status: 'FULL',
        },
      });

      const newStockFull = productFull.quantity - quantity;

      if (newStockFull < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      const newStock = product.quantity + quantity;

      if (newStock < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      await this.prismaService.product.update({
        where: { id: productFull.id },
        data: { quantity: newStockFull },
      });

      await this.prismaService.product.update({
        where: { id: productId },
        data: { quantity: newStock },
      });

      return;
    }
  }

  async markAsPaid(id: string, bankAccountId: string): Promise<void> {
    await this.prismaService.sales.update({
      where: {
        id,
      },
      data: {
        paid: true,
        transaction: {
          update: {
            bankAccountId,
          },
        },
      },
    });
  }

  async markAllAsPaid(
    customerId: string,
    bankAccountId: string,
  ): Promise<void> {
    const sales = await this.prismaService.sales.findMany({
      where: { customerId },
      include: { transaction: true },
    });

    await Promise.all(
      sales.map((sale) =>
        this.prismaService.sales.update({
          where: { id: sale.id },
          data: {
            paid: true,
            transaction: {
              update: { bankAccountId },
            },
          },
          include: { transaction: true },
        }),
      ),
    );
  }

  async findById(id: string): Promise<Sale | null> {
    const raw = await this.prismaService.sales.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        products: {
          include: {
            product: true,
            sale: true,
          },
        },
        transaction: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaSalesMapper.toDomain(raw);
  }

  async findAll(
    deliveryman: string,
    customer: string,
    orderByField: SortType = 'customer',
    orderDirection: 'desc' | 'asc' = 'desc',
    filterParams?: {
      saleType: 'EMPTY' | 'FULL' | 'COMODATO';
      startDate: Date;
      endDate: Date;
    },
    pagination?: PaginationParams,
  ): Promise<Sale[]> {
    let orderBy = {};

    if (orderByField === 'customer') {
      orderBy = {
        ...orderBy,
        customer: {
          name: orderDirection,
        },
      };
    }

    if (orderByField === 'deliveryman') {
      orderBy = {
        ...orderBy,
        transaction: {
          user: {
            name: orderDirection,
          },
        },
      };
    }

    if (orderByField !== 'customer' && orderByField !== 'deliveryman') {
      orderBy[orderByField] = orderDirection;
    }

    let whereFilter = {};

    if (filterParams) {
      if (filterParams.saleType) {
        whereFilter = { ...whereFilter, saleType: filterParams.saleType };
      }

      if (filterParams.startDate && filterParams.endDate) {
        const startDate = new Date(filterParams.startDate);
        const endDate = new Date(filterParams.endDate);

        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        };
      }
    }

    if (deliveryman || customer) {
      const raw = await this.prismaService.sales.findMany({
        ...(pagination?.itemsPerPage ? { take: pagination.itemsPerPage } : {}),
        ...(pagination?.page
          ? { skip: (pagination.page - 1) * pagination.itemsPerPage }
          : {}),
        where: {
          OR: [
            {
              customer: customer
                ? {
                    name: {
                      contains: customer,
                      mode: 'insensitive',
                    },
                  }
                : {},
            },
            {
              transaction: {
                user: {
                  name: deliveryman
                    ? {
                        contains: deliveryman,
                        mode: 'insensitive',
                      }
                    : {},
                },
              },
            },
          ],
          ...whereFilter,
        },
        include: {
          customer: true,
          products: {
            include: {
              product: true,
              sale: true,
            },
          },
          transaction: {
            include: {
              user: true,
            },
          },
        },
        orderBy: orderBy,
      });

      return raw.map(PrismaSalesMapper.toDomain);
    }

    const raw = await this.prismaService.sales.findMany({
      ...(pagination?.itemsPerPage ? { take: pagination.itemsPerPage } : {}),
      ...(pagination?.page
        ? { skip: (pagination.page - 1) * pagination.itemsPerPage }
        : {}),
      where: {
        ...whereFilter,
      },
      include: {
        customer: true,
        products: {
          include: {
            product: true,
            sale: true,
          },
        },
        transaction: {
          include: {
            user: true,
          },
        },
      },
      orderBy: orderBy,
    });

    return raw.map(PrismaSalesMapper.toDomain);
  }

  async findAllByDeliveryman(
    deliverymanId: string,
    pagination?: PaginationParams,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Sale[]> {
    let whereFilter = {};

    if (startDate && endDate) {
      whereFilter = {
        ...whereFilter,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    }

    const raw = await this.prismaService.sales.findMany({
      where: {
        transaction: {
          userId: deliverymanId,
        },
        ...whereFilter,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        transaction: {
          include: {
            user: true,
          },
        },
        customer: true,
      },
      take: pagination.itemsPerPage,
      skip: (pagination.page - 1) * pagination.itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return raw.map(PrismaSalesMapper.toDomain);
  }

  async getTotalRevenuesByDeliveryman(deliverymanId: string): Promise<number> {
    const { startOfDay, endOfDay } =
      await this.dateService.startAndEndOfTheDay();
    const total = await this.prismaService.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        sales: {
          some: {
            transaction: {
              userId: deliverymanId,
            },
          },
        },
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    return total._sum.amount || 0;
  }

  async getTotalMoneySalesByDeliveryman(
    deliverymanId: string,
  ): Promise<number> {
    const { startOfDay, endOfDay } =
      await this.dateService.startAndEndOfTheDay();
    const total = await this.prismaService.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        sales: {
          some: {
            AND: [
              {
                transaction: {
                  userId: deliverymanId,
                },
              },
              {
                paymentMethod: 'DINHEIRO',
              },
            ],
          },
        },
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    return total._sum.amount || 0;
  }

  async getTotalBalanceByDeliverymanYesterday(
    deliverymanId: string,
  ): Promise<number> {
    const { startOfYesterday, endOfYesterday } =
      await this.dateService.startAndEndOfYesterday();

    const deliveryman = await this.prismaService.user.findUnique({
      where: {
        id: deliverymanId,
      },
    });

    if (!deliveryman) {
      return 0;
    }

    const saleTransactions = await this.prismaService.transaction.findMany({
      where: {
        category: 'SALE',
        userId: deliverymanId,
        sales: {
          some: {
            paymentMethod: {
              equals: 'DINHEIRO',
            },
          },
        },
        createdAt: {
          gte: startOfYesterday,
          lte: endOfYesterday,
        },
      },
    });

    const saleTotal = saleTransactions.reduce((acc, curr) => {
      return acc + (curr.amount || 0);
    }, 0);

    const transferTransactions = await this.prismaService.transaction.findMany({
      where: {
        category: 'TRANSFER',
        userId: deliverymanId,
        createdAt: {
          gte: startOfYesterday,
          lte: endOfYesterday,
        },
      },
    });

    const transferTotal = transferTransactions.reduce((acc, curr) => {
      return acc + (curr.amount || 0);
    }, 0);

    const expenseTransactions = await this.prismaService.transaction.findMany({
      where: {
        category: {
          in: ['EXPENSE', 'DEPOSIT'],
        },
        userId: deliverymanId,
        createdAt: {
          gte: startOfYesterday,
          lte: endOfYesterday,
        },
      },
    });

    const expenseTotal = expenseTransactions.reduce((acc, curr) => {
      return acc + (curr.amount || 0);
    }, 0);

    const finalBalance = saleTotal + transferTotal - expenseTotal;

    return finalBalance;
  }

  async getTotalMoneySalesByDeliverymanYesterday(
    deliverymanId: string,
  ): Promise<number> {
    const { startOfYesterday, endOfYesterday } =
      await this.dateService.startAndEndOfYesterday();
    const total = await this.prismaService.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        sales: {
          some: {
            AND: [
              {
                transaction: {
                  userId: deliverymanId,
                },
              },
              {
                paymentMethod: 'DINHEIRO',
              },
            ],
          },
        },
        createdAt: {
          gte: startOfYesterday,
          lt: endOfYesterday,
        },
      },
    });

    return total._sum.amount || 0;
  }

  async findComodatoByCustomer(customerId: string): Promise<number> {
    const raw = await this.prismaService.sales.findMany({
      where: {
        AND: [
          {
            products: {
              some: {
                product: {
                  status: 'COMODATO',
                },
              },
            },
          },
          {
            customerId,
          },
        ],
      },
      include: {
        products: {
          where: {
            product: {
              status: 'COMODATO',
            },
          },
          include: {
            product: true,
          },
        },
        transaction: {
          include: {
            user: true,
          },
        },
        customer: true,
      },
    });

    const count = raw.reduce((total, sale) => {
      const productCount = sale.products.reduce(
        (sum, product) => sum + product.quantity,
        0,
      );
      return total + productCount;
    }, 0);

    return count;
  }

  async findAllComodato(pagination?: PaginationParams): Promise<Sale[]> {
    const raw = await this.prismaService.sales.findMany({
      where: {
        products: {
          some: {
            product: {
              status: 'COMODATO',
            },
          },
        },
      },
      include: {
        products: {
          where: {
            product: {
              status: 'COMODATO',
            },
          },
          include: {
            product: true, // Inclui os detalhes do produto
          },
        },
        transaction: {
          include: {
            user: true,
          },
        },
        customer: true,
      },
      take: pagination.itemsPerPage,
      skip: (pagination.page - 1) * pagination.itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return raw.map(PrismaSalesMapper.toDomain);
  }

  async revertStock(
    productId: string,
    quantity: number,
    status: BottleStatus,
  ): Promise<void> {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado', {
        cause: new Error('Produto não encontrado'),
        description: 'Produto não encontrado',
      });
    }

    if (status === 'FULL') {
      const newStock = product.quantity + quantity;

      await this.prismaService.product.update({
        where: { id: productId },
        data: { quantity: newStock },
      });

      return;
    }

    if (status === 'EMPTY') {
      const productFull = await this.prismaService.product.findFirst({
        where: {
          type: product.type,
          status: 'FULL',
        },
      });

      const newStockFull = productFull.quantity + quantity;

      if (newStockFull < 0) {
        throw new BadRequestException(
          'Estoque de bujão cheio insuficiente para fazer a troca',
          {
            cause: new Error(
              'Estoque de bujão cheio insuficiente para fazer a troca',
            ),
            description:
              'Estoque de bujão cheio insuficiente para fazer a troca',
          },
        );
      }

      const newStock = product.quantity - quantity;

      console.log({
        productFullQuantity: productFull.quantity,
        productQuantity: product.quantity,
        newStockFull,
        newStock,
      });

      if (newStock < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      await this.prismaService.product.update({
        where: { id: productFull.id },
        data: { quantity: newStockFull },
      });

      await this.prismaService.product.update({
        where: { id: productId },
        data: { quantity: newStock },
      });

      return;
    }

    if (status === 'COMODATO') {
      const productFull = await this.prismaService.product.findFirst({
        where: {
          type: product.type,
          status: 'FULL',
        },
      });

      const newStockFull = productFull.quantity + quantity;

      if (newStockFull < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      const newStock = product.quantity - quantity;

      if (newStock < 0) {
        throw new BadRequestException('Estoque insuficiente', {
          cause: new Error('Estoque insuficiente'),
          description: 'Estoque insuficiente',
        });
      }

      await this.prismaService.product.update({
        where: { id: productFull.id },
        data: { quantity: newStockFull },
      });

      await this.prismaService.product.update({
        where: { id: productId },
        data: { quantity: newStock },
      });

      return;
    }
  }

  async addComodato(
    customerId: string,
    quantity: number,
    typeSale: BottleStatus,
    productId: string,
  ) {
    const raw = await this.prismaService.customerWithComodato.findFirst({
      where: {
        customerId,
      },
      include: {
        products: {
          where: {
            AND: [
              {
                productId,
              },
            ],
          },
        },
      },
    });

    const updated = await this.prismaService.customerWithComodato.update({
      where: {
        id: raw.id,
      },
      data: {
        quantity: {
          increment: quantity,
        },
        products: {
          update: {
            where: {
              id: raw.products[0].id,
            },
            data: {
              quantity: {
                increment: quantity,
              },
            },
          },
        },
      },
      include: {
        products: true,
      },
    });
  }

  async revertComodato(
    customerId: string,
    quantity: number,
    typeSale: BottleStatus,
    productId: string,
  ) {
    const raw = await this.prismaService.customerWithComodato.findFirst({
      where: {
        customerId,
      },
      include: {
        products: {
          where: {
            productId,
          },
        },
      },
    });

    if (!raw) {
      throw new BadRequestException('Erro');
    }

    const updated = await this.prismaService.customerWithComodato.update({
      where: {
        id: raw.id,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
        products: {
          update: {
            where: {
              id: raw.products[0].id,
            },
            data: {
              quantity: {
                decrement: quantity,
              },
            },
          },
        },
      },
      include: {
        products: true,
      },
    });
  }

  async deleteSale(saleId: string): Promise<void> {
    const sale = await this.prismaService.sales.findUnique({
      where: {
        id: saleId,
      },
      include: {
        products: true,
      },
    });

    await Promise.all(
      sale.products.map(async (product) => {
        await this.revertStock(
          product.productId,
          product.quantity,
          product.typeSale,
        );

        if (product.typeSale === 'COMODATO') {
          await this.revertComodato(
            sale.customerId,
            product.quantity,
            product.typeSale,
            product.productId,
          );
        }
      }),
    );

    await this.prismaService.transaction.deleteMany({
      where: {
        sales: {
          some: {
            id: saleId,
          },
        },
      },
    });

    await this.prismaService.sales.delete({
      where: { id: saleId },
    });
  }

  async update(sale: Sale): Promise<void> {
    const dbSale = await this.prismaService.sales.findUnique({
      where: {
        id: sale.id,
      },
    });

    if (dbSale.paymentMethod !== sale.paymentMethod) {
      const toPrisma = PrismaSalesMapper.toPrisma(sale);

      await this.prismaService.sales.update({
        where: {
          id: sale.id,
        },
        data: {
          ...toPrisma,
        },
      });

      const result = await this.prismaService.bankAccount.findFirst({
        where: {
          paymentsAssociated: {
            hasSome: sale.paymentMethod,
          },
        },
      });

      if (!result) {
        return null;
      }

      await this.prismaService.transaction.update({
        where: {
          id: sale.transactionId,
        },
        data: {
          createdAt: sale.createdAt,
          bankAccountId: result.id,
          bank: result.bank,
        },
      });

      return;
    }

    const toPrisma = PrismaSalesMapper.toPrisma(sale);

    await this.prismaService.sales.update({
      where: {
        id: sale.id,
      },
      data: {
        ...toPrisma,
      },
    });

    await this.prismaService.transaction.update({
      where: {
        id: sale.transactionId,
      },
      data: {
        createdAt: sale.createdAt,
      },
    });
  }

  async getSalesIndicators(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<{
    totalSales: number;
    totalPerDay: { createdAt: Date; total: number }[];
    totalPerMonth: { year: number; month: number; total: number }[];
  }> {
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);
    const whereFilter: any = {
      createdAt: {
        gte: startDate,
        lte: adjustedEndDate,
      },
      ...(deliverymanId ? { transaction: { userId: deliverymanId } } : {}),
    };

    const totalSales = await this.prismaService.sales.aggregate({
      _sum: {
        total: true,
      },
      where: whereFilter,
    });

    const salesPerDay = await this.prismaService.sales.findMany({
      where: whereFilter,
      select: {
        createdAt: true,
        total: true,
      },
    });

    const totalPerDay = salesPerDay.reduce((acc, sale) => {
      const date = sale.createdAt.toISOString().split('T')[0];

      if (!acc[date]) {
        acc[date] = { createdAt: sale.createdAt, total: 0 };
      }

      acc[date].total += Number(sale.total);
      return acc;
    }, {} as Record<string, { createdAt: Date; total: number }>);

    const formattedTotalPerDay = Object.values(totalPerDay);

    const salesPerMonth = await this.prismaService.sales.groupBy({
      by: ['createdAt'],
      where: whereFilter,
      _sum: {
        total: true,
      },
    });

    const totalPerMonth = salesPerMonth.map((sale) => {
      const date = new Date(sale.createdAt);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        total: Number(sale._sum.total / 100),
      };
    });

    return {
      totalSales: Number(totalSales._sum.total / 100 || 0),
      totalPerDay: formattedTotalPerDay,
      totalPerMonth,
    };
  }

  async getAverageSales(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<{
    averageDailySales: number;
    averageMonthlySales: number;
  }> {
    const today = new Date();

    if (!startDate || isNaN(startDate.getTime())) {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    if (!endDate || isNaN(endDate.getTime())) {
      endDate = today;
    }

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);
    const whereFilter: any = {
      createdAt: {
        gte: startDate,
        lte: adjustedEndDate,
      },
      ...(deliverymanId ? { transaction: { userId: deliverymanId } } : {}),
    };

    const sales = await this.prismaService.sales.findMany({
      where: whereFilter,
      select: {
        total: true,
      },
    });

    const totalSalesAmount = sales.reduce(
      (acc, sale) => acc + Number(sale.total),
      0,
    );
    const numberOfDays =
      Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;

    const currentMonth = endDate.getMonth() - startDate.getMonth() + 1;
    const numberOfMonths = currentMonth;

    const averageDailySales = totalSalesAmount / numberOfDays;
    const averageMonthlySales = totalSalesAmount / numberOfMonths;

    return {
      averageDailySales: Number(averageDailySales?.toFixed(2)) / 100 || 0,
      averageMonthlySales: Number(averageMonthlySales?.toFixed(2)) / 100 || 0,
    };
  }
  async getTotalMoneySalesByPaymentMethodFiado(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<number> {
    const today = new Date();

    if (!startDate || isNaN(startDate.getTime())) {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    if (!endDate || isNaN(endDate.getTime())) {
      endDate = today;
    }
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);
    const sales = await this.prismaService.sales.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentMethod: 'FIADO',
        createdAt: {
          gte: startDate,
          lte: adjustedEndDate,
        },
        ...(deliverymanId && { deliverymanId }),
      },
    });

    return sales._sum.total / 100 || 0;
  }
  async getCustomersWithPositiveFiadoDebts(
    pagination?: PaginationParams,
  ): Promise<
    {
      customerId: string;
      customerName: string;
      totalDebt: number;
    }[]
  > {
    const debts = await this.prismaService.sales.findMany({
      where: {
        paymentMethod: 'FIADO',
        total: { gte: 0 },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: pagination?.itemsPerPage
        ? Number(pagination.itemsPerPage)
        : undefined,
      skip: pagination?.page
        ? (pagination.page - 1) * Number(pagination.itemsPerPage)
        : undefined,
    });

    return debts
      .filter((debts) => debts.total > 0)
      .map((debt) => ({
        id: debt.id,
        customerId: debt.customerId,
        customerName: debt.customer.name,
        totalDebt: debt.total / 100,
        paid: debt.paid,
      }));
  }

  async getCustomersWithPositiveFiadoDebtsByCustomer(
    customerId: string,
    pagination?: PaginationParams,
  ): Promise<
    { customerId: string; customerName: string; totalDebt: number }[]
  > {
    const debts = await this.prismaService.sales.findMany({
      where: {
        paymentMethod: 'FIADO',
        total: { gte: 0 },
        customerId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: pagination?.itemsPerPage
        ? Number(pagination.itemsPerPage)
        : undefined,
      skip: pagination?.page
        ? (pagination.page - 1) * Number(pagination.itemsPerPage)
        : undefined,
    });

    return debts
      .filter((debts) => debts.total > 0)
      .map((debt) => ({
        id: debt.id,
        customerId: debt.customerId,
        customerName: debt.customer.name,
        totalDebt: debt.total / 100,
        paid: debt.paid,
      }));
  }

  async getCustomersWithPositiveFiadoDebtsTotal(
    pagination?: PaginationParams,
  ): Promise<
    {
      customerId: string;
      customerName: string;
      totalDebt: number;
    }[]
  > {
    const debts = await this.prismaService.sales.findMany({
      where: {
        paymentMethod: 'FIADO',
        total: { gte: 0 },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      // take: pagination?.itemsPerPage
      //   ? Number(pagination.itemsPerPage)
      //   : undefined,
      // skip: pagination?.page
      //   ? (pagination.page - 1) * Number(pagination.itemsPerPage)
      //   : undefined,
    });

    const customerDebts: {
      [key: string]: {
        customerId: string;
        customerName: string;
        totalDebt: number;
        paid: boolean;
        sales: { id: string; paid: boolean }[];
      };
    } = {};

    debts.forEach((sale) => {
      const customerId = sale.customer.id;
      if (!customerDebts[customerId]) {
        customerDebts[customerId] = {
          customerId,
          customerName: sale.customer.name,
          totalDebt: 0,
          paid: sale.paid,
          sales: [],
        };
      }

      if (!sale.paid) {
        customerDebts[customerId].totalDebt += sale.total;
      }

      customerDebts[customerId].sales.push(sale);
    });

    const formattedDebts = Object.entries(customerDebts).map(
      ([id, debt]: [string, any]) => ({
        id,
        customerId: debt.customerId,
        customerName: debt.customerName,
        totalDebt: debt.totalDebt / 100,
        paid: debt.paid,
        sales: debt.sales,
      }),
    );

    const page = pagination?.page || 1; // Página atual (padrão: 1)
    const itemsPerPage = pagination?.itemsPerPage || 10; // Itens por página (padrão: 10)
    const startIndex = (page - 1) * itemsPerPage; // Índice inicial
    const endIndex = startIndex + itemsPerPage;

    return formattedDebts.slice(startIndex, endIndex);
  }

  async getTotalSalesByPaymentMethod(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<Record<PaymentMethod, string>> {
    const whereClause: any = {};
    const today = new Date();

    if (!startDate || isNaN(startDate.getTime())) {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    if (!endDate || isNaN(endDate.getTime())) {
      endDate = today;
    }

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);

    if (deliverymanId) {
      whereClause.deliverymanId = deliverymanId;
    }

    whereClause.createdAt = {
      gte: startDate,
      lte: adjustedEndDate,
    };

    const result = await this.prismaService.sales.groupBy({
      by: ['paymentMethod'],
      _sum: {
        total: true,
      },
      where: whereClause,
    });

    const formattedResult = result.reduce((acc, curr) => {
      const totalValue = curr._sum.total || 0;
      const adjustedTotalValue = totalValue / 100;

      acc[curr.paymentMethod] = adjustedTotalValue;

      return acc;
    }, {} as Record<PaymentMethod, number>);

    const formattedStringResult: Record<PaymentMethod, string> = Object.keys(
      formattedResult,
    ).reduce((acc, key) => {
      const value = formattedResult[key as PaymentMethod];

      acc[key as PaymentMethod] = value.toFixed(2).replace('.', ',');
      return acc;
    }, {} as Record<PaymentMethod, string>);

    return formattedStringResult;
  }
  async getTotalSalesByPaymentMethodForToday(
    deliverymanId: string,
  ): Promise<Record<string, string>> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await this.prismaService.sales.groupBy({
      by: ['paymentMethod'],
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        transaction: {
          userId: deliverymanId,
        },
      },
      _sum: {
        total: true,
      },
    });

    const result: Record<string, string> = {};

    sales.forEach((sale) => {
      const totalValue = (sale._sum.total || 0) / 100;
      result[sale.paymentMethod] = totalValue.toFixed(2);
    });

    const allPaymentMethods = await this.prismaService.sales.findMany({
      select: {
        paymentMethod: true,
      },
      distinct: ['paymentMethod'],
    });

    allPaymentMethods.forEach((method) => {
      if (!(method.paymentMethod in result)) {
        result[method.paymentMethod] = '0,00';
      }
    });

    return result;
  }
}
