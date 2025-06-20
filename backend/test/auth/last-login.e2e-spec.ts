import { app, mockUser, registerAndLogin, userRepo } from '../setup';

describe('lastLogin', () => {
  it('é atualizado após login', async () => {
    await registerAndLogin(mockUser);
    const user = await userRepo.findOne({ where: { email: mockUser.email } });
    expect(user?.lastLogin).toBeInstanceOf(Date);
  });
});
