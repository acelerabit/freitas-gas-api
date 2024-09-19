import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/application/entities/user';
import { UsersRepository } from 'src/application/repositories/user-repository';

export interface UpdateUserRequest {
  id: string;
  name: string;
  email: string;
  role: 'DELIVERYMAN' | 'ADMIN';
  acceptNotifications: boolean;
  status: boolean;
}

export interface UpdateUserResponse {
  user: User;
}

@Injectable()
export class UpdateUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    email,
    name,
    role,
    acceptNotifications,
    status,
  }: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new BadRequestException('Não foi possivel editar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const updates: Partial<User> = {};

    if (email) {
      updates.email = email;
    }

    if (name) {
      updates.name = name;
    }

    if (typeof acceptNotifications === 'boolean') {
      updates.acceptNotifications = acceptNotifications;
    }

    if (role) {
      updates.role = role;
    }

    if (typeof status === 'boolean') {
      updates.status = status;
    }

    Object.assign(user, updates);

    await this.usersRepository.update(user);

    return { user };
  }
}
