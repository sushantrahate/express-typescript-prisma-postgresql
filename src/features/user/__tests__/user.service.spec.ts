import bcrypt from 'bcrypt';
import { unifiedResponse } from 'uni-response';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR, SUCCESS } from '../../../constants/messages';
import { generateToken } from '../../../utils/generate-token.util';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';

vi.mock('bcrypt', () => {
  return {
    hash: vi.fn().mockResolvedValue('hashedpassword'),
    compare: vi.fn().mockResolvedValue(true),
  };
});

vi.mock('../../../utils/generateToken.util', () => ({
  generateToken: vi.fn(),
}));

vi.mock('uni-response', () => ({
  unifiedResponse: vi.fn(),
}));

describe('UserService', () => {
  let userRepository: UserRepository;
  let userService: UserService;

  beforeEach(() => {
    userRepository = {
      findUserByEmail: vi.fn(),
      findUserById: vi.fn(),
      createUser: vi.fn(),
    } as unknown as UserRepository;

    userService = new UserService(userRepository);
  });

  it('should return heartbeat response', async () => {
    (unifiedResponse as any).mockReturnValue({ success: true, message: 'Ok, From user' });

    const response = await userService.heartbeat();

    expect(response).toEqual({ success: true, message: 'Ok, From user' });
  });

  it('should return error when user not found during login', async () => {
    (userRepository.findUserByEmail as any).mockResolvedValue(null);

    const response = await userService.login({ email: 'notfound@example.com', password: 'pass' });

    expect(response).toEqual(unifiedResponse(false, ERROR.USER_NOT_FOUND));
  });

  it('should return error if email already exists during registration', async () => {
    (userRepository.findUserByEmail as any).mockResolvedValue({ id: '123' });

    const response = await userService.register({
      email: 'existing@example.com',
      password: 'password123',
      password2: 'password123',
      firstName: 'John',
    });

    expect(response).toEqual(unifiedResponse(false, ERROR.USER_EXISTS_WITH_EMAIL));
  });

  it('should return error when user not found during profile fetch', async () => {
    (userRepository.findUserById as any).mockResolvedValue(null);

    const response = await userService.getProfile('nonexistent_id');

    expect(response).toEqual(unifiedResponse(false, ERROR.USER_NOT_FOUND));
  });

  it('should return user profile when found', async () => {
    const mockUser = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    (userRepository.findUserById as any).mockResolvedValue(mockUser);

    const response = await userService.getProfile('123');

    expect(response).toEqual(unifiedResponse(true, SUCCESS.USER_FOUND, mockUser));
  });
});
