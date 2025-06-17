import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be user or admin' })
  role?: Role;
}
