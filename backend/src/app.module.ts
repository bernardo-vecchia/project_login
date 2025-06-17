import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'process.env.DB_HOST',
      port: Number(process.env.DB_PORT),
      username: 'process.env.DB_USER',
      password: 'process.env.DB_PASSWORD',
      database: 'process.env.DB_NAME',
      autoLoadEntities: true,
      synchronize: true, // não usar em produção com 'true'
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }