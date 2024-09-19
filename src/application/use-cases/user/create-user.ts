import { HashGenerator } from '@/application/cryptography/hash-generator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';

interface UserRequest {
  name: string;
  email: string;
  role: 'ADMIN' | 'DELIVERYMAN';
  password: string;
}

interface UserResponse {
  user: User;
}

@Injectable()
export class CreateUser {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(request: UserRequest): Promise<UserResponse> {
    const { email, password, name, role } = request;

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new BadRequestException(`Usuário com email ${email} já existe`, {
        cause: new Error(`Usuário com email ${email} já existe`),
        description: `Usuário com email ${email} já existe`,
      });
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      role,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await this.usersRepository.create(user);

    return { user };
  }
}
