import { app } from '../setup';
import * as request from 'supertest';

describe('POST /auth/register', () => {
  it('criar usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Lola Dalla Vecchia',
        email: 'lola@email.com',
        password: 'novoteste',
      })
      .expect(201);

    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('name', 'Lola Dalla Vecchia');
    expect(res.body.user).toHaveProperty('email', 'lola@email.com');
  });
});
