import { app, adminToken, userRepo } from '../setup';
import * as request from 'supertest';

describe('GET /users/inactive', () => {
  it('retorna inativos há +30 dias', async () => {
    await userRepo.save(
      userRepo.create({
        name: 'Cristine Zimmer',
        email: 'cristiane@email.com',
        password: 'senha1234',
        role: 'user',
        lastLogin: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
      })
    );

    const res = await request(app.getHttpServer())
      .get('/users/inactive')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'cristiane@email.com' }),
      ])
    );
  });
});
