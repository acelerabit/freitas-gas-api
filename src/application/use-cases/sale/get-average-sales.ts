import { Injectable } from '@nestjs/common';
import { SalesRepository } from '@/application/repositories/sales-repository';
interface GetAverageSalesRequest {
  startDate: Date;
  endDate: Date;
  deliverymanId?: string;
}
interface GetAverageSalesResponse {
  averageDailySales: number;
  averageMonthlySales: number;
}
@Injectable()
export class GetAverageSalesUseCase {
  constructor(private salesRepository: SalesRepository) {}
  async execute({
    startDate,
    endDate,
    deliverymanId,
  }: GetAverageSalesRequest): Promise<GetAverageSalesResponse> {
    const { averageDailySales, averageMonthlySales } =
      await this.salesRepository.getAverageSales(
        startDate,
        endDate,
        deliverymanId,
      );
    return {
      averageDailySales,
      averageMonthlySales,
    };
  }
}
