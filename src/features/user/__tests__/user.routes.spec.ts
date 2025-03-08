import { Router } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { auth } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import router from '../routes/user.routes'; // Adjust the import path as needed

// Mock dependencies
vi.mock('../controllers/user.controller', () => {
  const mockUserController = {
    heartbeat: vi.fn(() => {}),
    register: vi.fn(() => {}),
    login: vi.fn(() => {}),
    getProfile: vi.fn(() => {}),
  };
  return {
    UserController: class {
      constructor() {
        return mockUserController;
      }
    },
  };
});
vi.mock('../../../middleware/auth.middleware', () => ({
  auth: vi.fn(() => (req: any, res: any, next: any) => next()),
}));
vi.mock('../../../middleware/validation.middleware', () => ({
  validateRequest: vi.fn(() => (req: any, res: any, next: any) => next()),
}));
vi.mock('../../../config/env-config', () => ({
  env: {
    NODE_ENV: 'test',
    DATABASE_URL: 'mock://database-url',
    SHADOW_DATABASE_URL: 'mock://shadow-database-url',
    JWT_SECRET: 'mock-jwt-secret',
    WHITE_LIST_URLS: 'http://localhost:3000',
  },
}));
vi.mock('../../../config/prisma.config', () => {
  const mockPrismaClient = {};
  return {
    PrismaService: class {
      static getInstance = vi.fn(() => ({
        client: mockPrismaClient,
      }));
    },
  };
});

describe('User Routes Configuration', () => {
  beforeEach(() => {
    // Reset mocks to clear call counts
    vi.clearAllMocks();
  });

  it('should define GET / with heartbeat handler', () => {
    const routeLayer = router.stack.find(
      (layer: any) => layer.route?.path === '/' && layer.route?.methods.get,
    );
    expect(routeLayer).toBeDefined();
    expect(routeLayer?.route).toBeDefined();
    if (routeLayer?.route) {
      expect(routeLayer.route.stack[0].handle).not.toBeUndefined();
    }
  });

  it('should define POST /register with validation and register handler', () => {
    const routeLayer = router.stack.find(
      (layer: any) => layer.route?.path === '/register' && layer.route?.methods.post,
    );
    expect(routeLayer).toBeDefined();
    expect(routeLayer?.route).toBeDefined();
    if (routeLayer?.route) {
      expect(routeLayer.route.stack.length).toBe(2); // Middleware + handler
      expect(routeLayer.route.stack[0].handle).not.toBeUndefined(); // validateRequest
      expect(routeLayer.route.stack[1].handle).not.toBeUndefined(); // register
    }
  });

  it('should define POST /login with validation and login handler', () => {
    const routeLayer = router.stack.find(
      (layer: any) => layer.route?.path === '/login' && layer.route?.methods.post,
    );
    expect(routeLayer).toBeDefined();
    expect(routeLayer?.route).toBeDefined();
    if (routeLayer?.route) {
      expect(routeLayer.route.stack.length).toBe(2); // Middleware + handler
      expect(routeLayer.route.stack[0].handle).not.toBeUndefined(); // validateRequest
      expect(routeLayer.route.stack[1].handle).not.toBeUndefined(); // login
    }
  });

  it('should define GET /profile with auth and getProfile handler', () => {
    const routeLayer = router.stack.find(
      (layer: any) => layer.route?.path === '/profile' && layer.route?.methods.get,
    );
    expect(routeLayer).toBeDefined();
    expect(routeLayer?.route).toBeDefined();
    if (routeLayer?.route) {
      expect(routeLayer.route.stack.length).toBe(2); // Middleware + handler
      expect(routeLayer.route.stack[0].handle).not.toBeUndefined(); // auth
      expect(routeLayer.route.stack[1].handle).not.toBeUndefined(); // getProfile
    }
  });
});
