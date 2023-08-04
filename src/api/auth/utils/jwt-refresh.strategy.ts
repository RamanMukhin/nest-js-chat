import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from 'src/api/users/responses/user.response';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRETE,
    });
  }

  public async validate(payload: UserResponse): Promise<UserResponse> {
    const user = await this.authService.validateIfUserStillExists(
      payload.login,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
