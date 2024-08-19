import { Encrypter } from '@/application/cryptography/encrypter';
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { EMAIL_QUEUE } from 'src/common/constants';

export interface SendForgotEmailRequest {
  email: string;
}

@Injectable()
export class SendForgotEmail {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,

    @InjectQueue(EMAIL_QUEUE) private sendMailQueue: Queue,
  ) {}

  async execute({ email }: SendForgotEmailRequest): Promise<void> {
    const userFound = await this.usersRepository.findByEmail(email);

    if (!userFound) {
      throw new BadRequestException('Não foi possivel encontrar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const expiresIn = '5m';
    const token = await this.encrypter.encrypt({ email }, expiresIn);

    await this.sendMailQueue.add('sendMail-job', {
      email: email,
      subject: 'Recuperação de Senha: Clique aqui para redefinir sua senha',
      text: `Olá,\n Você solicitou recentemente a redefinição de sua senha. Para continuar, clique no link abaixo:\n\n\n ${process.env.FRONTEND_URL}/recovery-password/redefine?token=${token}
    \n
    `,
    });

    return;
  }
}
