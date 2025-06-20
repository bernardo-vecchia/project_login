import { app, mockUser, registerAndLogin } from '../setup';
import * as request from 'supertest';

describe('GET /users/profile', () => {
  it('retorna perfil autenticado', async () => {
    const token = await registerAndLogin(mockUser);

    const res = await request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', mockUser.email);
    expect(res.body).not.toHaveProperty('password');
  });
});
