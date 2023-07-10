import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserResponse } from 'src/api/users/responses/user.response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRETE,
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
