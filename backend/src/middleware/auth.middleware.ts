import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser, User, UserDocument } from '@/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface RequestWithUser extends Request {
  user?: Omit<UserDocument, 'password'>;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.slice(7).trim();
    try {
      // 1) verify the JWT
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as jwt.JwtPayload;

      // 2) load the user (minus password)
      const user = await this.userModel
        .findById(payload.id)
        .select('-password')
        .lean();
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, no user' });
      }

      // 3) attach to request and continue
      req.user = user;
      return next();
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
}
