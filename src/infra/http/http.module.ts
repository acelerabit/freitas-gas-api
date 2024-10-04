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
import { RegisterSaleUseCase } from '@/application/use-cases/sale/register-sale';
import { CreateTransactionUseCase } from '@/application/use-cases/transaction/create-transaction';
import { SalesController } from './controllers/sale/sales.controller';
import { CreateProductUseCase } from '@/application/use-cases/product/create-product';
import { DeleteProductUseCase } from '@/application/use-cases/product/delete-product';
import { ListProductsUseCase } from '@/application/use-cases/product/find-all-product';
import { GetProductByIdUseCase } from '@/application/use-cases/product/find-product-by-id';
import { UpdateProductUseCase } from '@/application/use-cases/product/update-product';
import { ProductController } from './controllers/product/products.controller';
import { FindAllCustomersWithoutPaginateUseCase } from '@/application/use-cases/customer/findAllCustomersWithoutPaginate';
import { FetchSalesUseCase } from '@/application/use-cases/sale/fetch-sales';
import { GetSaleUseCase } from '@/application/use-cases/sale/get-sale';
import { DeleteSaleUseCase } from '@/application/use-cases/sale/delete-sale';
import { UpdateSaleUseCase } from '@/application/use-cases/sale/update-sale';

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
    SalesController,
    ProductController,
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
    CreateCustomerUseCase,
    FindAllCustomersUseCase,
    FindCustomerByIdUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    RegisterSaleUseCase,
    CreateTransactionUseCase,
    CreateProductUseCase,
    DeleteProductUseCase,
    ListProductsUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    FindAllCustomersWithoutPaginateUseCase,
    FetchSalesUseCase,
    GetSaleUseCase,
    DeleteSaleUseCase
    UpdateSaleUseCase,
  ],
  imports: [DatabaseModule, EmailModule, CryptographyModule, SchedulesModule],
})
export class HttpModule {}
