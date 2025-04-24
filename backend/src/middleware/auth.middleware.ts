import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser, User } from '../models/User';

interface RequestWithUser extends Request {
  user?: IUser;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    let token: string | undefined;

    if (req?.headers?.authorization?.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded: jwt.JwtPayload = jwt.verify(
          token,
          process.env.JWT_SECRET as string,
        ) as jwt.JwtPayload;

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, no user' });
        }

        next();
      } catch (error) {
        console.error('Token verification error:', error);
        return res
          .status(401)
          .json({ message: 'Not authorized, token failed' });
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  }
}
