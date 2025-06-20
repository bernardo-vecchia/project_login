import { app, mockUser, registerAndLogin, userRepo } from '../setup';
import * as request from 'supertest';

describe('POST /auth/login', () => {
  it('retorna token ao logar', async () => {
    const token = await registerAndLogin(mockUser);
    expect(token).toBeDefined();
  });

  it('rejeita senha incorreta', async () => {
    await userRepo.save(userRepo.create(mockUser));

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: mockUser.email,
        password: 'fispjfpsd',
      })
      .expect(401);
  });
});
