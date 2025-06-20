import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/users.entity';
import * as request from 'supertest';

export let app: INestApplication;
export let userRepo: Repository<User>;
export let dataSource: DataSource;
export let adminToken: string;

export const mockUser = {
  name: 'Julaine Zimmer Dalla Vecchia',
  email: 'julianezimmerdalla@email.com',
  password: 'teste321',
  role: 'admin' as const,
};

export async function registerAndLogin(userData: {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}) {
  await request(app.getHttpServer()).post('/auth/register').send(userData);

  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: userData.email, password: userData.password });

  return res.body.access_token;
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env2',
      }),
      AppModule,
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  userRepo = moduleFixture.get(getRepositoryToken(User));
  dataSource = moduleFixture.get(DataSource);
});

afterAll(async () => {
  await dataSource.destroy();
  await app.close();
});

beforeEach(async () => {
  await userRepo.query('DELETE FROM users');
  adminToken = await registerAndLogin({
    name: 'Bernardo Admin',
    email: 'bernardo@email.com',
    password: 'beradmin123',
    role: 'admin',
  });
});
