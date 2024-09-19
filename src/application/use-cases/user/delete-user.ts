import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/user-repository';

@Injectable()
export class DeleteUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: { id: string }) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(id);
  }
}
