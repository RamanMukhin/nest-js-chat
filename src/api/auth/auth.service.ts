import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { UserResponse } from '../users/responses/user.response';
import { AuthResponse } from './responses/auth.response';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { jwtExpirationType } from 'src/common/types';
import { RETURN_NEW_OPTION } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
  ) {}

  public async signUp(signUpDto: SignUpDto): Promise<void> {
    await this.usersService.create(signUpDto);
  }

  public async validateUser(
    signInDto: Omit<SignInDto, 'fingerprint'>,
  ): Promise<UserResponse | null> {
    const user = await this.usersService.findOneByLogin(signInDto.login);

    if (user) {
      await this.usersService.checkPassword(signInDto.password, user.password);

      return User.getResponse(user);
    }

    return null;
  }

  public async validateIfUserStillExists(
    login: string,
  ): Promise<UserResponse | null> {
    return this.usersService.findOneByLogin(login);
  }

  public async signIn(
    fingerprint: string,
    userResponse: UserResponse & jwtExpirationType,
  ): Promise<AuthResponse> {
    const tokens = await this.generateJwtTokens(userResponse);

    await this.authModel.findOneAndUpdate(
      { userId: userResponse._id, fingerprint },
      {
        refreshToken: tokens.refreshToken,
      },
      { upsert: true, ...RETURN_NEW_OPTION },
    );

    return tokens;
  }

  public async refresh(
    fingerprint: string,
    userResponse: UserResponse & jwtExpirationType,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const session = await this.authModel.findOne({
      userId: userResponse._id,
      fingerprint,
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    if (refreshToken !== session.refreshToken) {
      throw new ForbiddenException('Incorrect token');
    }

    delete userResponse.exp;
    delete userResponse.iat;

    const tokens = await this.signIn(fingerprint, userResponse);

    return tokens;
  }

  public async logoutUser(
    fingerprint: string,
    userResponse: UserResponse & jwtExpirationType,
  ): Promise<void> {
    await this.authModel.findOneAndUpdate(
      { userId: userResponse._id, fingerprint },
      {
        refreshToken: null,
      },
    );
  }

  public async generateJwtTokens(payload: UserResponse): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRETE'),
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRETE'),
      expiresIn: '7 days',
    });

    return { accessToken, refreshToken };
  }

  public async validateToken(token: string): Promise<UserResponse> {
    const payload: UserResponse = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRETE'),
    });

    return payload;
  }
}
