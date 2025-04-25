import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@/user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('User already exists');

    const user = new this.userModel({ ...dto });
    await user.save();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: this.generateToken(user.id),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const matches = await bcrypt.compare(dto.password, user.password);
    if (!matches) throw new UnauthorizedException('Invalid credentials');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: this.generateToken(user.id),
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      university: user.university,
      address: user.address,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    const updated = await user.save();

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      university: updated.university,
      address: updated.address,
      token: this.generateToken(updated.id),
    };
  }
}
