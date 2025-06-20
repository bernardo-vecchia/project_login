import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserActivity, UserStats } from '../interfaces/user-activity.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findAll(
    role?: string,
    sortBy: 'name' | 'createdAt' = 'name',
    order: 'asc' | 'desc' = 'asc',
  ): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (role) {
      query.where('user.role = :role', { role });
    }

    query.orderBy(`user.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');

    return await query.getMany();
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<User>) {
    await this.usersRepository.update(id, data);
    return this.findById(id);
  }

  delete(id: string) {
    return this.usersRepository.delete(id);
  }

  async findInactive() {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 30);

    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.lastLogin IS NULL OR user.lastLogin < :limit', { limit: dateLimit })
      .getMany();
  }

  async getUserActivities(userId: string): Promise<UserActivity[]> {
    const user = await this.findById(userId);
    if (!user) return [];

    const activities: UserActivity[] = [];
    
    if (user.lastLogin) {
      activities.push({
        id: '1',
        userId: user.id,
        action: 'Login realizado',
        timestamp: user.lastLogin,
        description: 'Usuário fez login no sistema'
      });
    }

    if (user.updatedAt && user.updatedAt.getTime() !== user.createdAt.getTime()) {
      activities.push({
        id: '2',
        userId: user.id,
        action: 'Perfil atualizado',
        timestamp: user.updatedAt,
        description: 'Informações do perfil foram atualizadas'
      });
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const user = await this.findById(userId);
    if (!user) {
      return {
        daysActive: 0,
        profileUpdates: 0,
        securityScore: 0,
        lastLogin: null
      };
    }

    const now = new Date();
    const createdAt = new Date(user.createdAt);
    const daysActive = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    const profileUpdates = user.updatedAt.getTime() !== user.createdAt.getTime() ? 1 : 0;
    
    const securityScore = user.lastLogin ? 100 : 50;

    return {
      daysActive,
      profileUpdates,
      securityScore,
      lastLogin: user.lastLogin
    };
  }
}