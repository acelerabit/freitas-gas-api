import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { LoginUser } from 'src/application/use-cases/authenticate/login-user';
import { LoggingInterceptor } from 'src/infra/interceptors/logging.interceptor';
import { LoggingService } from 'src/infra/services/logging.service';
import { AuthenticateUserBody } from './dtos/authenticate-user-body';
import { LoginWithGoogle } from '@/application/use-cases/authenticate/login-with-google';
import { AuthenticateUserWithGoogleBody } from './dtos/authenticate-with-google-body';

@Controller('auth')
export class AuthController {
  constructor(
    private loginUser: LoginUser,
    private loginWithGoogle: LoginWithGoogle,
  ) {}

  @Post('/login')
  async login(@Body() body: AuthenticateUserBody) {
    const { email, password } = body;

    const { accessToken, user } = await this.loginUser.execute({
      email,
      password,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  @Post('/login-with-google')
  async google(@Body() body: AuthenticateUserWithGoogleBody) {
    const { email, name } = body;

    const { accessToken, user } = await this.loginWithGoogle.execute({
      email,
      name,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}
