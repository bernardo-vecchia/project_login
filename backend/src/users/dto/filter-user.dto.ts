import { IsEnum, IsOptional, IsIn } from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class FilterUserDto {
  @IsOptional()
  @IsEnum(Role, { message: 'Role deve ser user ou admin' })
  role?: Role;

  @IsOptional()
  @IsIn(['name', 'createdAt'], { message: 'sortBy deve ser name ou createdAt' })
  sortBy?: 'name' | 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'order deve ser asc ou desc' })
  order?: 'asc' | 'desc';
}