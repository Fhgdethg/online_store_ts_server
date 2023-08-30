import { Router } from 'express';
import { check } from 'express-validator';

import authController from '../controllers/auth.controller.js';

import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/registration', [
  check('email', 'Uncorrect email').isEmail(),
  check('password', 'Password must be longer, that 3 symbols').isLength({
    min: 3,
    max: 12,
  }),
  authController.registration,
]);

router.post('/login', authController.login);

router.get('/auth', authMiddleware, authController.auth);

export default router;
