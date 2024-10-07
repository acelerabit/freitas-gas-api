import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { User } from 'src/application/entities/user';

@Injectable()
export class FetchAllUsers {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<User[]> {
    const users = await this.usersRepository.findAllWithoutPaginate();
    return users;
  }
}
