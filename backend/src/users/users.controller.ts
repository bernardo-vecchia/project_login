import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // aplica globalmente ao controller
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('admin') // apenas admins podem acessar essa rota
  findAll() {
    return this.usersService.findAll();
  }
}