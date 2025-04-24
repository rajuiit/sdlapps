import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { User, IUser } from '../models/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

interface RequestWithUser extends Request {
  user?: IUser;
}

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface UpdateProfileDTO {
  name?: string;
  email?: string;
  university?: string;
  address?: string;
}

@Controller('api/auth')
export class AuthController {
  private generateToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    });
  }

  @Post('register')
  async registerUser(@Body() body: RegisterDTO, @Res() res: Response) {
    try {
      const userExists = await User.findOne({ email: body.email });
      if (userExists)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'User already exists' });

      const user = await User.create(body);
      return res.status(HttpStatus.CREATED).json({
        id: user.id as string,
        name: user.name,
        email: user.email,
        token: this.generateToken(user.id as string),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Post('login')
  async loginUser(@Body() body: LoginDTO, @Res() res: Response) {
    try {
      const user = await User.findOne({ email: body.email });
      if (user && (await bcrypt.compare(body.password, user.password))) {
        return res.json({
          id: user.id as string,
          name: user.name,
          email: user.email,
          token: this.generateToken(user.id as string),
        });
      }
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid email or password' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }

      return res.status(HttpStatus.OK).json({
        name: user.name,
        email: user.email,
        university: user.university,
        address: user.address,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Put('profile')
  async updateUserProfile(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileDTO,
    @Res() res: Response,
  ) {
    try {
      const user = await User.findById(req.user?.id);
      if (!user)
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });

      const { name, email, university, address } = body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (university) user.university = university;
      if (address) user.address = address;

      const updatedUser = await user.save();
      return res.json({
        id: updatedUser.id as string,
        name: updatedUser.name,
        email: updatedUser.email,
        university: updatedUser.university,
        address: updatedUser.address,
        token: this.generateToken(updatedUser.id as string),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }
}
