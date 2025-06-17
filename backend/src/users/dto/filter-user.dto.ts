import { IsEnum, IsOptional, IsIn } from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
export class FilterUserDto {
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be user or admin' })
  role?: Role;

  @IsOptional()
  @IsIn(['name', 'createdAt'], { message: 'sortBy must be name or createdAt' })
  sortBy?: 'name' | 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'order must be asc or desc' })
  order?: 'asc' | 'desc';
}