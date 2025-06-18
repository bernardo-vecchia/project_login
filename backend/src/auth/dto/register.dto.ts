import { IsEmail, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;
}