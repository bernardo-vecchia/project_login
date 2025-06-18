import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../auth/user.decorator';
import { Controller, Get, Put, Delete, Param, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { Query } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Apenas ADMIN pode listar todos
  @Get()
  @Roles('admin')
  findAll(
    @Query('role') role?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    // Define valores padrão e validação das opções permitidas
    const validSortBy = sortBy === 'createdAt' ? 'createdAt' : 'name';
    const validOrder = order === 'desc' ? 'desc' : 'asc';
    return this.usersService.findAll();
  }

  // Qualquer usuário autenticado pode ver seu próprio perfil
  @Get('profile')
  getProfile(@CurrentUser() user) {
    return this.usersService.findById(user.userId);
  }

  // Admin ou o próprio usuário pode editar
  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user,
    @Body() body,
  ) {
    if (user.role !== 'admin' && user.userId !== id) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.usersService.update(id, body);
  }

  // Apenas admin pode deletar
  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  // Apenas admin pode ver usuários inativos
  @Get('inactive')
  @Roles('admin')
  async getInactiveUsers() {
    return this.usersService.findInactive();
  }

}