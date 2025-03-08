import { NextFunction, Request, Response } from 'express';

import { UserService } from '../services/user.service';
import { LoginInputTypes, RegisterInputTypes } from '../types/user.types';
export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  heartbeat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.userService.heartbeat();
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request<{}, {}, LoginInputTypes>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const loginInputObj: LoginInputTypes = req.body; // Map request body to Obj
      const result = await this.userService.login(loginInputObj);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  };

  register = async (
    req: Request<{}, {}, RegisterInputTypes>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const registerInputObj: RegisterInputTypes = req.body;
      const result = await this.userService.register(registerInputObj);
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId; // Assuming middleware adds `userId` to `req`
      //TODO: add better logic for userId check
      if (userId) {
        const result = await this.userService.getProfile(userId);
        res.status(result.success ? 200 : 404).json(result);
      }
    } catch (error) {
      next(error);
    }
  };
}
