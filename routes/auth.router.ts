import { Router } from 'express';
import { check } from 'express-validator';

import authController from '../controllers/auth.controller.js';

import authMiddleware from '../middleware/auth.middleware.js';

import { routes } from '../constants/routes.js'

const router = Router();

router.post(routes.registration, [
  check('email', 'Uncorrect email').isEmail(),
  check('password', 'Password must be longer, that 3 symbols').isLength({
    min: 3,
    max: 12,
  }),
  authController.registration,
]);

router.post(routes.login, authController.login);

router.get(routes.auth, authMiddleware, authController.auth);

export default router;
