import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User, UserModelType } from '../user/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const user = await this.userModel.create(signupDto);
    const { username, createdAt, email, _id } = user;
    const access_token = await this.signToken(user.id, user.email);

    return {
      success: true,
      message: 'You have successfully signup',
      data: { access_token, user: { _id, username, email, createdAt } },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');

    const isValid =
      user &&
      (await this.userModel.validatePassword(loginDto.password, user.password));

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = await this.signToken(user.id, user.email);
    return {
      success: true,
      message: 'You have successfully login',
      data: {
        access_token,
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
          createdAt: user.createdAt,
        },
      },
    };
  }

  signToken(userId: number, email: string): Promise<string> {
    const payload: JwtPayload = { sub: userId, email };

    const expiresIn: string | undefined = this.config.get('JWT_EXPIRES_IN');
    const secret: string | undefined = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, { expiresIn, secret });
  }
}
