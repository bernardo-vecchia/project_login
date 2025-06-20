import { app, adminToken, mockUser, userRepo } from '../setup';
import * as request from 'supertest';

describe('DELETE /users/:id', () => {
  it('admin deleta usuário', async () => {
    const user = await userRepo.save(userRepo.create(mockUser));

    await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
