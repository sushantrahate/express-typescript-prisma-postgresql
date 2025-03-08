import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: UserService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockUserService = {
      heartbeat: vi.fn().mockResolvedValue({ success: true }),
      login: vi.fn().mockResolvedValue({ success: true, token: 'mockToken' }),
      register: vi
        .fn()
        .mockResolvedValue({ success: true, user: { id: 1, email: 'test@example.com' } }),
      getProfile: vi
        .fn()
        .mockResolvedValue({ success: true, user: { id: 1, email: 'test@example.com' } }),
    } as unknown as UserService;

    userController = new UserController(mockUserService);
    mockRequest = {};
    mockResponse = { json: vi.fn(), status: vi.fn().mockReturnThis() };
    mockNext = vi.fn();
  });

  it('should return heartbeat response', async () => {
    await userController.heartbeat(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockUserService.heartbeat).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
  });

  it('should login a user and return token', async () => {
    mockRequest.body = { email: 'test@example.com', password: 'password123' };

    await userController.login(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockUserService.login).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true, token: 'mockToken' });
  });

  it('should register a user and return user data', async () => {
    mockRequest.body = { email: 'test@example.com', password: 'password123', name: 'Test User' };

    await userController.register(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockUserService.register).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      user: { id: 1, email: 'test@example.com' },
    });
  });

  it('should return user profile', async () => {
    mockRequest.userId = 1 as any; // Simulating userId from middleware

    await userController.getProfile(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockUserService.getProfile).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      user: { id: 1, email: 'test@example.com' },
    });
  });
});
