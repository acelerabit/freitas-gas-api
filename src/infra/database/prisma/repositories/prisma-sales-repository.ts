import { PrismaSalesMapper } from './../mappers/sale.mapper';
import { BottleStatus, PaymentMethod } from '@prisma/client';
import {
  SalesRepository,
  SortType,
} from '../../../../application/repositories/sales-repository';
import { Sale } from '../../../../application/entities/sale';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';

@Injectable()
export class PrismaSalesRepository extends SalesRepository {
  constructor(private prismaService: PrismaService) {
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
        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: new Date(filterParams.startDate),
            lte: new Date(filterParams.endDate),
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
  ): Promise<Sale[]> {
    const raw = await this.prismaService.sales.findMany({
      where: {
        transaction: {
          userId: deliverymanId,
        },
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

  async deleteSale(saleId: string): Promise<void> {
    await this.prismaService.sales.delete({
      where: { id: saleId },
    });
  }

  async update(sale: Sale): Promise<void> {
    const toPrisma = PrismaSalesMapper.toPrisma(sale);

    await this.prismaService.sales.update({
      where: {
        id: sale.id,
      },
      data: {
        ...toPrisma,
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
    const whereFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(deliverymanId
        ? {
            transaction: {
              userId: deliverymanId,
            },
          }
        : {}),
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

    const totalPerMonth = await this.prismaService.$queryRaw<
      { year: number; month: number; total: number }[]
    >`
      SELECT 
        EXTRACT(YEAR FROM "created_at") AS year,
        EXTRACT(MONTH FROM "created_at") AS month,
        SUM(total) AS total
      FROM sales
      WHERE "created_at" >= ${startDate} AND "created_at" <= ${endDate}
      GROUP BY year, month
    `;

    const formattedTotalPerMonth = totalPerMonth.map((item) => ({
      year: item.year,
      month: item.month,
      total: Number(item.total),
    }));

    return {
      totalSales: Number(totalSales._sum.total || 0),
      totalPerDay: formattedTotalPerDay,
      totalPerMonth: formattedTotalPerMonth,
    };
  }
}
