import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserBody {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  role: 'DELIVERYMAN' | 'ADMIN';

  @IsOptional()
  @IsNotEmpty()
  acceptNotifications: boolean;

  @IsOptional()
  @IsNotEmpty()
  status: boolean;
}
