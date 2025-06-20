import { IsEmail, IsNotEmpty, IsIn, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6, {
    message: 'A Senha deve conter pelo menos 6 caracteres',
  })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;
}