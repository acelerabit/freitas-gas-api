import { LoginWithGoogle } from '@/application/use-cases/authenticate/login-with-google';
import { CreateBankAccounts } from '@/application/use-cases/bank-account/create-bank-account';
import { DeleteBankAccounts } from '@/application/use-cases/bank-account/delete-bank-account';
import { FetchAllBankAccounts } from '@/application/use-cases/bank-account/fetch-bank-account';
import { UpdateBankAccount } from '@/application/use-cases/bank-account/update-bank-account';
import { CollectComodatoUseCase } from '@/application/use-cases/collect/collect-comodato';
import { FetchAllCollects } from '@/application/use-cases/collect/fetch-collects';
import { CreateCustomerUseCase } from '@/application/use-cases/customer/create-customer';
import { DeleteCustomerUseCase } from '@/application/use-cases/customer/delete-customer';
import { FindAllCustomersUseCase } from '@/application/use-cases/customer/find-all-customers';
import { FindCustomerByIdUseCase } from '@/application/use-cases/customer/find-customer-by-id';
import { FindAllCustomersWithoutPaginateUseCase } from '@/application/use-cases/customer/findAllCustomersWithoutPaginate';
import { UpdateCustomerUseCase } from '@/application/use-cases/customer/update-customer';
import { UsersMetrics } from '@/application/use-cases/dashboard/users-metrics';
import { CreateDebt } from '@/application/use-cases/debt/create-debt';
import { DeleteDebt } from '@/application/use-cases/debt/delete-debt';
import { UpdateDebt } from '@/application/use-cases/debt/update-debt';
import { FetchAllReadedNotifications } from '@/application/use-cases/notifications/fetch-all-readed-notifications';
import { FetchAllUnreadNotifications } from '@/application/use-cases/notifications/fetch-all-unread-notifications';
import { ReadAllNotifications } from '@/application/use-cases/notifications/read-all-unread-notifications';
import { ReadNotification } from '@/application/use-cases/notifications/read-notification';
import { CreateProductUseCase } from '@/application/use-cases/product/create-product';
import { DecreaseProductQuantityUseCase } from '@/application/use-cases/product/decrease-quantity';
import { DeleteProductUseCase } from '@/application/use-cases/product/delete-product';
import { ListProductsUseCase } from '@/application/use-cases/product/find-all-product';
import { GetProductByIdUseCase } from '@/application/use-cases/product/find-product-by-id';
import { IncreaseProductQuantityUseCase } from '@/application/use-cases/product/increase-quantity';
import { TransferProductQuantityUseCase } from '@/application/use-cases/product/transfer-quantity-product';
import { UpdateProductUseCase } from '@/application/use-cases/product/update-product';
import { SendForgotEmail } from '@/application/use-cases/recovery-password/send-forgot-email';
import { UpdatePassword } from '@/application/use-cases/recovery-password/update-password';
import { DeleteSaleUseCase } from '@/application/use-cases/sale/delete-sale';
import { FetchSalesByDeliverymanUseCase } from '@/application/use-cases/sale/fetch-by-deliveryman';
import { FetchComodatoSalesUseCase } from '@/application/use-cases/sale/fetch-comodato-sales';
import { FetchSalesUseCase } from '@/application/use-cases/sale/fetch-sales';
import { GetAverageSalesUseCase } from '@/application/use-cases/sale/get-average-sales';
import { GetSaleUseCase } from '@/application/use-cases/sale/get-sale';
import { GetSalesIndicatorsUseCase } from '@/application/use-cases/sale/get-sales-indicators';
import { GetTotalRevenuesDeliverymanToday } from '@/application/use-cases/sale/get-total-deliveryman-revenues-today';
import { GetTotalMoneySalesDeliverymanToday } from '@/application/use-cases/sale/get-total-money-today-deliveryman';
import { GetTotalMoneySalesByPaymentMethodFiado } from '@/application/use-cases/sale/get-total-sales-fiado';
import { RegisterSaleUseCase } from '@/application/use-cases/sale/register-sale';
import { UpdateSaleUseCase } from '@/application/use-cases/sale/update-sale';
import { CreateSupplier } from '@/application/use-cases/supplier/create-supplier';
import { DeleteSupplier } from '@/application/use-cases/supplier/delete-supplier';
import { GetAllSuppliers } from '@/application/use-cases/supplier/find-all-supplier';
import { GetSupplier } from '@/application/use-cases/supplier/get-supplier';
import { GetSupplierWithDebts } from '@/application/use-cases/supplier/get-supplier-with-debts';
import { UpdateSupplier } from '@/application/use-cases/supplier/update-supplier';
import { CalculateCompanyBalance } from '@/application/use-cases/transaction/calculate-company-balance';
import { CalculateDeliverymanBalance } from '@/application/use-cases/transaction/calculate-deliberyman-balance';
import { CreateTransactionUseCase } from '@/application/use-cases/transaction/create-transaction';
import { DeleteTransaction } from '@/application/use-cases/transaction/delete-transaction';
import { DepositToCompanyUseCase } from '@/application/use-cases/transaction/deposit-to-company';
import { FetchDepositsByDeliveryman } from '@/application/use-cases/transaction/fetch-deliveryman-deposits';
import { FetchDeposits } from '@/application/use-cases/transaction/fetch-deposits';
import { FetchExpenseTypesUseCase } from '@/application/use-cases/transaction/fetch-expense-types';
import { FetchExpenses } from '@/application/use-cases/transaction/fetch-expenses';
import { FetchExpensesByDeliveryman } from '@/application/use-cases/transaction/fetch-expenses-by-deliveryman';
import { FetchIncomeTypesUseCase } from '@/application/use-cases/transaction/fetch-income-types';
import { FindAllTransactionUseCase } from '@/application/use-cases/transaction/findall-transaction';
import { GetExpenseIndicators } from '@/application/use-cases/transaction/get-expense-indicators';
import { GetExpenseProportionByCategoryUseCase } from '@/application/use-cases/transaction/get-expense-proportion-by-category';
import { CalculateGrossProfit } from '@/application/use-cases/transaction/get-gross-profit';
import { GetSalesVsExpensesComparisonUseCase } from '@/application/use-cases/transaction/get-salevsexpense-comparisom';
import { GetTotalExpensesDeliverymanToday } from '@/application/use-cases/transaction/get-total-expenses-deliveryman-today';
import { TransferToDeliveryman } from '@/application/use-cases/transaction/transfer-to-deliveryman';
import { UpdateTransactionUseCase } from '@/application/use-cases/transaction/update-transaction';
import { UploadToProfile } from '@/application/use-cases/uploads/upload-to-profile';
import { DeleteUser } from '@/application/use-cases/user/delete-user';
import { FetchAllUsers } from '@/application/use-cases/user/fetch-all-user';
import { FetchDeliverymans } from '@/application/use-cases/user/fetch-deliverymans';
import { FetchUsers } from '@/application/use-cases/user/fetch-users';
import { GetUser } from '@/application/use-cases/user/get-user';
import { GetUserByEmail } from '@/application/use-cases/user/get-user-by-email';
import { UpdateUser } from '@/application/use-cases/user/update-user';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUser } from 'src/application/use-cases/authenticate/login-user';
import { FetchAllLogs } from 'src/application/use-cases/logs/fetch-all-logs';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { LoggingService } from '../services/logging.service';
import { Upload } from '../upload/upload';
import { WebsocketsGateway } from '../websocket/websocket.service';
import { AuthController } from './controllers/auth/auth.controller';
import { BankAccountController } from './controllers/bank-account/bank-account.controller';
import { CollectController } from './controllers/collect/collect.controller';
import { CustomerController } from './controllers/customer/customer.controller';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { DebtController } from './controllers/debt/debt.controller';
import { LogsController } from './controllers/logs/logs.controller';
import { NotificationController } from './controllers/notifications/notification.controller';
import { ProductController } from './controllers/product/products.controller';
import { RecoveryPasswordController } from './controllers/recovery-password/recovery-password.controller';
import { SalesController } from './controllers/sale/sales.controller';
import { SupplierController } from './controllers/supplier/supplier.controller';
import { TransactionsController } from './controllers/transactions/transaction.controller';
import { UploadController } from './controllers/uploads/upload-controller';
import { UsersController } from './controllers/users/users.controller';
import { GetCustomersWithPositiveFiadoDebts } from '@/application/use-cases/sale/get-customer-with-sale-fiado';
import { GetQuantityByCustomer } from '@/application/use-cases/collect/get-quantity-customer';
import { FetchAllUnreadNotificationsWithoutPaginate } from '@/application/use-cases/notifications/fetch-all-unread-without-paginate';
import { GetTotalSalesByPaymentMethodUseCase } from '@/application/use-cases/sale/get-total-sales-paymentMethod';
import { GetTotalSalesByPaymentMethodForTodayUseCase } from '@/application/use-cases/sale/get-total-sales-paymentMethod-today';
import { GetBankAccount } from '@/application/use-cases/bank-account/get-bank-account';
import { MarkAsPaid } from '@/application/use-cases/sale/mask-as-paid';
import { CalculateAccountsCompanyBalance } from '@/application/use-cases/transaction/calculate-accounts-company-balance';
import { AccountTransferController } from './controllers/account-transfer/account-transfer.controller';
import { CreateAccountTransfer } from '@/application/use-cases/account-transfer/create-account-transfer';
import { FetchAllAccountTransfers } from '@/application/use-cases/account-transfer/fetch-account-transfers';
import { DeleteAccountTransfer } from '@/application/use-cases/account-transfer/delete-account-transfer';
import { UpdateAccountTransfer } from '@/application/use-cases/account-transfer/update-account-transfer';
import { GetAccountTransfers } from '@/application/use-cases/account-transfer/get-account-transfer';

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
    TransactionsController,
    SupplierController,
    DebtController,
    CollectController,
    BankAccountController,
    AccountTransferController,
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
    DeleteSaleUseCase,
    UpdateSaleUseCase,
    CreateTransactionUseCase,
    DeleteTransaction,
    FindAllTransactionUseCase,
    UpdateTransactionUseCase,
    FetchAllUsers,
    IncreaseProductQuantityUseCase,
    DecreaseProductQuantityUseCase,
    FetchComodatoSalesUseCase,
    CreateDebt,
    UpdateDebt,
    CreateSupplier,
    DeleteSupplier,
    GetSupplier,
    GetSupplierWithDebts,
    UpdateSupplier,
    GetAllSuppliers,
    DeleteDebt,
    FetchExpenseTypesUseCase,
    TransferProductQuantityUseCase,
    GetSalesIndicatorsUseCase,
    FetchExpenses,
    CalculateCompanyBalance,
    TransferToDeliveryman,
    FetchDeliverymans,
    GetAverageSalesUseCase,
    GetExpenseIndicators,
    GetExpenseProportionByCategoryUseCase,
    FetchSalesByDeliverymanUseCase,
    FetchExpensesByDeliveryman,
    GetTotalExpensesDeliverymanToday,
    GetTotalRevenuesDeliverymanToday,
    CalculateDeliverymanBalance,
    DepositToCompanyUseCase,
    GetSalesVsExpensesComparisonUseCase,
    CalculateGrossProfit,
    FetchDepositsByDeliveryman,
    FetchDeposits,
    GetTotalMoneySalesDeliverymanToday,
    FetchIncomeTypesUseCase,
    FetchAllReadedNotifications,
    GetTotalMoneySalesByPaymentMethodFiado,
    CollectComodatoUseCase,
    FetchAllCollects,
    GetCustomersWithPositiveFiadoDebts,
    GetQuantityByCustomer,
    FetchAllUnreadNotificationsWithoutPaginate,
    CreateBankAccounts,
    FetchAllBankAccounts,
    DeleteBankAccounts,
    UpdateBankAccount,
    GetTotalSalesByPaymentMethodUseCase,
    GetTotalSalesByPaymentMethodForTodayUseCase,
    GetBankAccount,
    MarkAsPaid,
    CalculateAccountsCompanyBalance,
    CreateAccountTransfer,
    FetchAllAccountTransfers,
    DeleteAccountTransfer,
    UpdateAccountTransfer,
    GetAccountTransfers,
  ],
  imports: [DatabaseModule, EmailModule, CryptographyModule, SchedulesModule],
})
export class HttpModule {}
