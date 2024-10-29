import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@Injectable()
export class DateService {
  // Método para formatar uma data para o formato ISO
  formatDate(date: string | Date): string {
    return dayjs(date).toISOString();
  }

  toDate(date: string | Date) {
    return dayjs(date).toDate();
  }

  // Método para verificar se a data passada já ocorreu
  isDatePassed(date: string | Date): boolean {
    return dayjs(date).isBefore(dayjs(), 'day');
  }

  toUTC(date: Date) {
    return dayjs(date).utc().format('YYYY-MM-DD');
  }

  dateToSaveInDB(date: Date) {
    const dateFormat = dayjs(date).format('YYYY-MM-DD');

    return new Date(dateFormat.toString()).toISOString();
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  convertUnixToUTC(unix_time: string) {
    const unixDate = dayjs.unix(Number(unix_time));
    return dayjs(unixDate).utc().local().format();
  }
  sevenDaysAgo() {
    return dayjs().subtract(7, 'day').toDate();
  }

  yesterday() {
    return dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
  }

  startAndEndOfYesterday() {
    const startOfYesterday = dayjs().subtract(1, 'day').startOf('day').toDate(); // Início do dia atual
    const endOfYesterday = dayjs().subtract(1, 'day').endOf('day').toDate();

    return {
      startOfYesterday,
      endOfYesterday,
    };
  }

  startAndEndOfTheDay() {
    const startOfDay = dayjs().startOf('day').toDate(); // Início do dia atual
    const endOfDay = dayjs().endOf('day').toDate();

    return {
      startOfDay,
      endOfDay,
    };
  }
}
