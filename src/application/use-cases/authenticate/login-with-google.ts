import { Encrypter } from '@/application/cryptography/encrypter';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';

interface LoginWithGoogleRequest {
  email: string;
  name: string;
}

interface LoginWithGoogleResponse {
  accessToken: string;
  user: User;
}

@Injectable()
export class LoginWithGoogle {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: LoginWithGoogleRequest,
  ): Promise<LoginWithGoogleResponse> {
    const { email, name } = request;

    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      const token = await this.encrypter.encrypt({
        id: user.id,
        email: user.email,
      });

      delete user.password;

      return { accessToken: token, user };
    }

    const newUser = User.create({
      name,
      email,
      role: 'DELIVERYMAN',
      createdAt: new Date(),
    });

    const token = await this.encrypter.encrypt({
      id: newUser.id,
      email: newUser.email,
    });

    if (!token) {
      throw new BadRequestException('Erro ao fazer login');
    }

    await this.usersRepository.create(newUser);

    delete newUser.password;

    return { accessToken: token, user: newUser };
  }

  async logout(res: Response) {
    return res.send({ message: 'Usuário deslogado com suceeso' });
  }
}
