import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = `${process.env.SECRET_KEY}`;

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Auth error' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Auth error' });
  }
};

export default authMiddleware;
