import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // IP do banco
      port: 5432,
      username: 'username_do_banco',
      password: 'senha_do_banco',
      database: 'nome_do_banco',
      entities: [User],
      synchronize: true, // não usar em produção com true
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}