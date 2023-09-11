import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import User from '../models/User.js';

import userService from '../services/user.service.js';

import userRepository from "../repositories/user.repository.js";

class AuthController {
  async registration(req: any, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        return res
          .status(400)
          .send({ message: 'Validation error, data is not correct' });

      const registrationMessage = await userService.registration(req.body);

      return res.send({ message: registrationMessage });
    } catch (err) {
      res.send({ message: `${err}` });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data: any = await userService.login(req.body);

      if (data.message) return res.status(404).json(data);

      return res.json(data);
    } catch (err) {
      res.send({ message: 'Server error' });
    }
  }

  async auth(req: any, res: Response) {
    try {
      const data: any = await userRepository.findOneUser({ _id: req.user.id });

      if (data.message) return res.status(404).json(data);

      res.json(data);
    } catch (err) {
      res.send({ message: 'Server error' });
    }
  }
}

export default new AuthController();
