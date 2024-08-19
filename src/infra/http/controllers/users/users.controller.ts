import { UpdateUser } from '@/application/use-cases/user/update-user';
import { EMAIL_QUEUE } from '@/common/constants';
import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { JwtUserAuthGuard } from 'src/infra/auth/jwt.guard';
import { CreateUserBody } from './dtos/create-user-body';
import { UpdateUserBody } from './dtos/update-user-body';
import { ScheduleService } from '@/infra/schedules/schedules.service';
import { GetUser } from '@/application/use-cases/user/get-user';
import { GetUserBody } from './dtos/get-user-body';
import { GetUserByEmailBody } from './dtos/get-user-by-email';
import { GetUserByEmail } from '@/application/use-cases/user/get-user-by-email';
import { FetchUsers } from '@/application/use-cases/user/fetch-users';
import { UsersPresenters } from './presenters/user.presenter';

/** If you want catch data from requests and responses, enable it */

// const interceptor = new LoggingInterceptor(new LoggingService(), [
//   'password',
//   'access_token',
//   'user.email',
// ]);

@Controller('users')
export class UsersController {
  constructor(
    private createUser: CreateUser,
    private getUser: GetUser,
    private getUserByEmail: GetUserByEmail,
    private updateUser: UpdateUser,
    private fetchUsers: FetchUsers,
    @InjectQueue(EMAIL_QUEUE) private sendMailQueue: Queue,
  ) {}

  // @UseInterceptors(interceptor)
  @Post()
  async create(@Body() body: CreateUserBody) {
    const { email, password, role, name } = body;

    const { user } = await this.createUser.execute({
      name,
      email,
      password,
      role,
    });

    return {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id,
    };
  }

  @Get()
  async list(@Query() query: { page?: string; itemsPerPage?: string }) {
    const { page, itemsPerPage } = query;

    const { users } = await this.fetchUsers.execute({
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return users.map(UsersPresenters.toHTTP);
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const { user } = await this.getUser.execute({
      id,
    });

    return UsersPresenters.toHTTP(user);
  }

  @Post('/by-email')
  async getByEmail(@Body() body: GetUserByEmailBody) {
    const { email } = body;

    const { user } = await this.getUserByEmail.execute({
      email,
    });

    return UsersPresenters.toHTTP(user);
  }

  @Put('/update')
  async update(@Body() body: UpdateUserBody) {
    const { email, id, role, name, acceptNotifications } = body;

    const { user } = await this.updateUser.execute({
      name,
      email,
      role,
      id,
      acceptNotifications,
    });

    return UsersPresenters.toHTTP(user);
  }

  @UseGuards(JwtUserAuthGuard)
  @Get('/send-email')
  async sendMail() {
    await this.sendMailQueue.add('sendMail-job', { email: 'teste@gmail.com' });

    return;
  }
}
