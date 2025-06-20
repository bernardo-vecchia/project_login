import { app, adminToken } from '../setup';
import * as request from 'supertest';

describe('GET /users', () => {
  it('admin lista usuários filtrando por role', async () => {
    const res = await request(app.getHttpServer())
      .get('/users?role=admin&sortBy=name&order=asc')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].role).toBe('admin');
  });
});
