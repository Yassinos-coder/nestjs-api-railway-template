import assert from 'node:assert/strict';
import { beforeEach, describe, it, mock } from 'node:test';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user.interface';

describe('AuthService', () => {
  const user: User = {
    id: 'user-1',
    email: 'sam@example.com',
    passwordHash: bcrypt.hashSync('correct-password', 4),
    createdAt: new Date('2026-01-01'),
  };

  const findByEmail = mock.fn<(email: string) => Promise<User | null>>(async () => user);
  const create = mock.fn(async (email: string, passwordHash: string): Promise<User> => ({
    ...user,
    email,
    passwordHash,
  }));
  const usersRepository = { findByEmail, findById: mock.fn(), create };
  const jwtService = { signAsync: mock.fn(async () => 'signed-token') };
  const config = { getOrThrow: mock.fn(() => 3600) };

  const service = new AuthService(usersRepository as never, jwtService as never, config as never);

  beforeEach(() => {
    findByEmail.mock.resetCalls();
    create.mock.resetCalls();
    findByEmail.mock.mockImplementation(async () => user);
    create.mock.mockImplementation(async (email: string, passwordHash: string) => ({
      ...user,
      email,
      passwordHash,
    }));
  });

  it('logs in with the right password and never returns the hash', async () => {
    const result = await service.login({ email: 'Sam@Example.com', password: 'correct-password' });

    assert.equal(findByEmail.mock.calls[0].arguments[0], 'sam@example.com');
    assert.equal(result.accessToken, 'signed-token');
    assert.equal('passwordHash' in result.user, false);
  });

  it('rejects a wrong password', async () => {
    await assert.rejects(
      service.login({ email: user.email, password: 'wrong' }),
      UnauthorizedException,
    );
  });

  it('rejects an unknown email with the same error', async () => {
    findByEmail.mock.mockImplementation(async () => null);

    await assert.rejects(
      service.login({ email: 'nobody@example.com', password: 'x' }),
      /Invalid email or password/,
    );
  });

  it('stores a hash instead of the password on register', async () => {
    await service.register({ email: 'New@Example.com', password: 'plain-password' });

    const [email, storedHash] = create.mock.calls[0].arguments;
    assert.equal(email, 'new@example.com');
    assert.notEqual(storedHash, 'plain-password');
    assert.equal(await bcrypt.compare('plain-password', storedHash), true);
  });

  it('lets a duplicate email error through', async () => {
    create.mock.mockImplementation(async () => {
      throw new ConflictException();
    });

    await assert.rejects(
      service.register({ email: user.email, password: 'plain-password' }),
      ConflictException,
    );
  });
});
