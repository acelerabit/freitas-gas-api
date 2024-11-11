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
  Delete,
} from '@nestjs/common';
import { Role } from '@prisma/client';
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
import { DeleteUser } from '@/application/use-cases/user/delete-user';
import { Auth } from 'src/infra/decorators/auth.decorator';
import { FetchAllUsers } from '@/application/use-cases/user/fetch-all-user';
import { FetchDeliverymans } from '@/application/use-cases/user/fetch-deliverymans';

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
    private deleteUser: DeleteUser,
    private fetchAllUsers: FetchAllUsers,
    private fetchDeliverymans: FetchDeliverymans,
  ) {}

  @Auth(Role.ADMIN)
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

  @Auth(Role.ADMIN)
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

  @Auth(Role.ADMIN)
  @Get('/deliverymans')
  async fetch() {
    const deliverymans = await this.fetchDeliverymans.execute();

    return deliverymans.map(UsersPresenters.toHTTP);
  }

  @Post('/by-email')
  async getByEmail(@Body() body: GetUserByEmailBody) {
    const { email } = body;

    const { user } = await this.getUserByEmail.execute({
      email,
    });

    return UsersPresenters.toHTTP(user);
  }

  @Auth(Role.ADMIN)
  @Put('/update')
  async update(@Body() body: UpdateUserBody) {
    const { email, id, role, name, acceptNotifications, status } = body;

    const { user } = await this.updateUser.execute({
      name,
      email,
      role,
      id,
      acceptNotifications,
      status,
    });

    return UsersPresenters.toHTTP(user);
  }

  @Auth(Role.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.deleteUser.execute({ id });
    return { message: 'User deleted successfully' };
  }

  @Get('/all')
  async findAll() {
    const users = await this.fetchAllUsers.execute();
    return users;
  }

  @Auth(Role.ADMIN)
  @Get('/:id')
  async get(@Param('id') id: string) {
    const { user } = await this.getUser.execute({
      id,
    });
    return UsersPresenters.toHTTP(user);
  }
}
