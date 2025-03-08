import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserRepository } from '../repositories/user.repository';

// ✅ Properly mock PrismaClient
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findUnique: vi.fn(), // ✅ Ensure these are properly mocked
      create: vi.fn(),
    },
  })),
}));

describe('UserRepository', () => {
  let prisma: PrismaClient;
  let userRepository: UserRepository;

  beforeEach(() => {
    prisma = new PrismaClient();
    userRepository = new UserRepository(prisma);
  });

  it('should find a user by email', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: '123',
      password: 'hashedpassword',
      role: { name: 'admin' }, // ✅ Matches the Prisma query
    } as any); // ✅ Type assertion to override TypeScript error

    const user = await userRepository.findUserByEmail('test@example.com');

    expect(user).toBeDefined();
    expect(user?.id).toBe('123');
    expect(user?.role?.name).toBe('admin');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: { id: true, password: true, role: { select: { name: true } } },
    });
  });

  it('should return null if user not found by email', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const user = await userRepository.findUserByEmail('notfound@example.com');

    expect(user).toBeNull();
  });

  it('should create a new user', async () => {
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: '123',
      role: { name: 'user' },
    } as any);

    const newUser = await userRepository.createUser({
      email: 'new@example.com',
      password: 'hashedpassword',
      firstName: 'John',
    });

    expect(newUser).toBeDefined();
    expect(newUser?.id).toBe('123');
    expect(newUser?.role?.name).toBe('user');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'new@example.com',
        password: 'hashedpassword',
        firstName: 'John',
      },
      select: { id: true, role: { select: { name: true } } },
    });
  });
});
