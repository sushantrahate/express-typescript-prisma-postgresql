import bcrypt from 'bcrypt';
import { unifiedResponse } from 'uni-response';

import { ERROR, SUCCESS } from '../../../constants/messages';
import { generateToken } from '../../../utils/generate-token.util';
import { UserRepository } from '../repositories/user.repository';
import { LoginInputTypes, RegisterInputTypes } from '../types/user.types';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async heartbeat() {
    return unifiedResponse(true, 'Ok, From user');
  }

  async login(loginInputObj: LoginInputTypes) {
    const { email, password } = loginInputObj;
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      return unifiedResponse(false, ERROR.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return unifiedResponse(false, 'Invalid credentials');
    }

    const token = generateToken(user.id, user.role?.name || 'user');
    return unifiedResponse(true, SUCCESS.LOGIN_SUCCESSFUL, { token });
  }

  async register(registerInputObj: RegisterInputTypes) {
    const { email, password, firstName } = registerInputObj;

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      return unifiedResponse(false, ERROR.USER_EXISTS_WITH_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      firstName,
    });

    const token = generateToken(newUser.id, newUser.role?.name || 'user');
    return unifiedResponse(true, SUCCESS.REGISTRATION_SUCCESSFUL, { token });
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      return unifiedResponse(false, ERROR.USER_NOT_FOUND);
    }
    return unifiedResponse(true, SUCCESS.USER_FOUND, user);
  }
}
