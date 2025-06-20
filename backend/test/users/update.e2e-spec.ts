import { app, mockUser, registerAndLogin } from '../setup';
import * as request from 'supertest';

describe('PATCH /users/:id', () => {
  it('atualiza nome do usuário logado', async () => {
    const token = await registerAndLogin(mockUser);

    const profile = await request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`);

    const userId = profile.body.id;

    const res = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Teste Nome' })
      .expect(200);

    expect(res.body.name).toBe('Teste Nome');
  });
});
