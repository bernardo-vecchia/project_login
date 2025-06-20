import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role deve ser user ou admin' })
  role?: Role;
}