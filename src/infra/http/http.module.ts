import { LoginWithGoogle } from '@/application/use-cases/authenticate/login-with-google';
import { UsersMetrics } from '@/application/use-cases/dashboard/users-metrics';
import { FetchAllUnreadNotifications } from '@/application/use-cases/notifications/fetch-all-unread-notifications';
import { ReadAllNotifications } from '@/application/use-cases/notifications/read-all-unread-notifications';
import { ReadNotification } from '@/application/use-cases/notifications/read-notification';
import { SendForgotEmail } from '@/application/use-cases/recovery-password/send-forgot-email';
import { UpdatePassword } from '@/application/use-cases/recovery-password/update-password';
import { UploadToProfile } from '@/application/use-cases/uploads/upload-to-profile';
import { FetchUsers } from '@/application/use-cases/user/fetch-users';
import { GetUser } from '@/application/use-cases/user/get-user';
import { GetUserByEmail } from '@/application/use-cases/user/get-user-by-email';
import { UpdateUser } from '@/application/use-cases/user/update-user';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUser } from 'src/application/use-cases/authenticate/login-user';
import { FetchAllLogs } from 'src/application/use-cases/logs/fetch-all-logs';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { LoggingService } from '../services/logging.service';
import { Upload } from '../upload/upload';
import { WebsocketsGateway } from '../websocket/websocket.service';
import { AuthController } from './controllers/auth/auth.controller';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { LogsController } from './controllers/logs/logs.controller';
import { NotificationController } from './controllers/notifications/notification.controller';
import { RecoveryPasswordController } from './controllers/recovery-password/recovery-password.controller';
import { UploadController } from './controllers/uploads/upload-controller';
import { UsersController } from './controllers/users/users.controller';
import { DeleteUser } from '@/application/use-cases/user/delete-user';
import { CreateCustomerUseCase } from '@/application/use-cases/customer/create-customer';
import { FindAllCustomersUseCase } from '@/application/use-cases/customer/find-all-customers';
import { FindCustomerByIdUseCase } from '@/application/use-cases/customer/find-customer-by-id';
import { UpdateCustomerUseCase } from '@/application/use-cases/customer/update-customer';
import { DeleteCustomerUseCase } from '@/application/use-cases/customer/delete-customer';
import { CustomerController } from './controllers/customer/customer.controller';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { PrismaCustomersRepository } from '../database/prisma/repositories/prisma-customers-repository';

@Module({
  controllers: [
    UsersController,
    AuthController,
    LogsController,
    NotificationController,
    RecoveryPasswordController,
    UploadController,
    DashboardController,
    CustomerController,
  ],
  providers: [
    CreateUser,
    LoginUser,
    LoginWithGoogle,
    FetchAllLogs,
    UpdateUser,
    JwtService,
    LoggingService,
    FetchAllUnreadNotifications,
    ReadNotification,
    WebsocketsGateway,
    UpdatePassword,
    SendForgotEmail,
    Upload,
    GetUserByEmail,
    GetUser,
    UsersMetrics,
    FetchUsers,
    UploadToProfile,
    ReadAllNotifications,
    DeleteUser,
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
    CreateCustomerUseCase,
    FindAllCustomersUseCase,
    FindCustomerByIdUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  imports: [DatabaseModule, EmailModule, CryptographyModule, SchedulesModule],
})
export class HttpModule {}
