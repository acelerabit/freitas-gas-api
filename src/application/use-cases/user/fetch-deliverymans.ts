import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { User } from 'src/application/entities/user';

@Injectable()
export class FetchDeliverymans {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<User[]> {
    const deliverymans =
      await this.usersRepository.findAllDeliverymansWithoutPaginate();
    return deliverymans;
  }
}
