import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { prisma } from '../config/prisma';
import { isEmailValid } from '../utils/validator.util';
import { generateToken } from '../utils/generateToken.util';
import { createResponse } from '../utils/response.util';
import { SUCCESS, ERROR } from '../constants/messages';

// @desc    Login
// @route   POST localhost:4000/v1/users/login
// @access  Public
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (email && !isEmailValid(email)) {
    return res
      .status(400)
      .json(createResponse(false, null, ERROR.ENTER_VALID_EMAIL));
  }

  if (!password) {
    return res.status(400).json(createResponse(false, null, 'Enter password'));
  }

  // let user: { id: string } | null = null;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (user) {
      if (user.password == null) {
        const response = createResponse(
          false,
          null,
          'No password found for the user'
        );
        return res.status(200).json(response);
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        const response = createResponse(false, null, 'Incorrect password');
        return res.status(401).json(response);
      }
      const userRole = user?.role?.name || 'user';
      const token = generateToken(user.id, userRole);
      const response = createResponse(
        true,
        { userId: user.id, role: userRole, token },
        SUCCESS.LOGIN_SUCCESSFUL
      );
      return res.status(200).json(response);
    }
    const response = createResponse(false, null, ERROR.USER_NOT_FOUND);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST localhost:4000/v1/users/register
// @access  Public
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, email, password, password2 } = req.body;

  if (!firstName) {
    return res
      .status(400)
      .json(createResponse(false, null, ERROR.ENTER_VALID_NAME));
  }

  if (!email || !isEmailValid(email)) {
    return res
      .status(400)
      .json(createResponse(false, null, ERROR.ENTER_VALID_EMAIL));
  }

  if (!password || !password2 || password !== password2) {
    return res
      .status(400)
      .json(createResponse(false, null, 'Enter Valid Password'));
  }

  try {
    const userExists: User | null = await prisma.user.findFirst({
      where: { email },
    });

    if (userExists) {
      switch (true) {
        case userExists.email === email:
          return res
            .status(409)
            .json(createResponse(false, null, ERROR.USER_EXISTS_WITH_EMAIL));
        default:
          return res
            .status(400)
            .json(createResponse(false, null, ERROR.INVALID_USER_DATA));
      }
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (newUser) {
      const userRole = newUser?.role?.name || 'user';
      const token = generateToken(newUser.id, userRole);

      return res
        .status(201)
        .json(createResponse(true, token, SUCCESS.REGISTRATION_SUCCESSFUL));
    }

    return res
      .status(400)
      .json(createResponse(false, null, ERROR.INVALID_USER_DATA));
  } catch (error) {
    next(error);
  }
};

// @desc    Get Profile info (Only pass token in header as authorization: bearer token)
// @route   GET localhost:4000/v1/users/profile
// @access  private
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      const response = createResponse(false, null, ERROR.USER_NOT_FOUND);
      return res.status(200).json(response);
    }

    const data = user;
    const response = createResponse(true, data, SUCCESS.USER_FOUND);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export { login, registerUser, getProfile };
