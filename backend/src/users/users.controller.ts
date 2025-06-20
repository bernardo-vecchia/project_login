
import {
  Controller, Get, Delete, Param, Body, UseGuards,
  ForbiddenException, Patch, Query
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../auth/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserActivity, UserStats } from '../interfaces/user-activity.interface';

@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Apenas ADMIN pode listar todos
  @Get()
  @Roles('admin')
  findAll(
    @Query('role') role?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    const validSortBy = sortBy === 'createdAt' ? 'createdAt' : 'name';
    const validOrder = order === 'desc' ? 'desc' : 'asc';
    return this.usersService.findAll(role, validSortBy, validOrder);
  }

  // Qualquer usuário autenticado pode ver seu próprio perfil
  @Get('profile')
  async getProfile(@CurrentUser() user) {
    const userData = await this.usersService.findById(user.userId);
    if (!userData) {
      return null;
    }
    const { password, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  }

  // Atualiza o perfil do usuário autenticado
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user,
    @Body() body,
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new ForbiddenException('Nenhum dado enviado para atualização');
    }

    const updatedUser = await this.usersService.update(user.userId, body);
    if (!updatedUser) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // Atualiza nome/email (restrição para não-admins)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user,
    @Body() body,
  ) {
    if (user.role !== 'admin' && user.userId !== id) {
      throw new ForbiddenException('Acesso negado');
    }

    if (!body || Object.keys(body).length === 0) {
      throw new ForbiddenException('Nenhum dado enviado para atualização');
    }

    const updatedUser = await this.usersService.update(id, body);
    if (!updatedUser) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
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

  // Buscar atividades do usuário autenticado
  @Get('activities')
  async getUserActivities(@CurrentUser() user): Promise<UserActivity[]> {
    return this.usersService.getUserActivities(user.userId);
  }

  // Buscar estatísticas do usuário autenticado
  @Get('stats')
  async getUserStats(@CurrentUser() user): Promise<UserStats> {
    return this.usersService.getUserStats(user.userId);
  }

  // Admin pode ver atividades de qualquer usuário
  @Get(':id/activities')
  @Roles('admin')
  async getUserActivitiesById(@Param('id') id: string): Promise<UserActivity[]> {
    return this.usersService.getUserActivities(id);
  }

  // Admin pode ver estatísticas de qualquer usuário
  @Get(':id/stats')
  @Roles('admin')
  async getUserStatsById(@Param('id') id: string): Promise<UserStats> {
    return this.usersService.getUserStats(id);
  }
}