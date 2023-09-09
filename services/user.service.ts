import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import File from '../models/File.js';

import fileService from './file.service.js';

import userRepository from '../repositories/user.repository.js';

import { IUserMinimal } from '../types/userTypes';
import { Response } from 'express';

const SECRET_KEY = `${process.env.SECRET_KEY}`;

class UserService {
  async registration(body: IUserMinimal) {
    try {
      const { email, password } = body;
      const candidate: any = await userRepository.findOneUser({ email });

      if (candidate) return `User with email ${email} already exist`;

      const hashPassword = await bcrypt.hash(password, 7);
      const addedUser = await userRepository.addUser({
        email,
        password: hashPassword,
      });

      await fileService.createDir(
        new File({
          user: addedUser.id,
        }),
      );
      return 'User was created';
    } catch (err) {
      return `${err}`;
    }
  }

  async login(body: IUserMinimal) {
    try {
      const { email, password } = body;
      const user: any = await userRepository.findOneUser({ email });

      if (!user) return { message: 'User not found' };

      const isPassValid = await bcrypt.compare(password, user.password);

      if (!isPassValid) return { message: 'Password is not correct' };

      const token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: '1h',
      });

      const { id, diskSpace, usedSpace, photo } = user;

      return {
        token,
        user: {
          id: user.id,
          email,
          diskSpace,
          usedSpace,
          photo,
        },
      };
    } catch (err) {
      return { message: 'Server error' };
    }
  }

  async auth(reqUser: any) {
    try {
      const user: any = await userRepository.findOneUser({ _id: reqUser.id });

      const { id, email, diskSpace, usedSpace, photo } = user;

      const token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: '1h',
      });

      return {
        token,
        user: {
          id,
          email,
          diskSpace,
          usedSpace,
          photo,
        },
      };
    } catch (err) {
      return { message: 'Server error' };
    }
  }
}

export default new UserService();
