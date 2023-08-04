import { constants as httpConstants } from 'http2';
import { STATUS_CODES as statusCodes } from 'http';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from 'src/api/users/responses/user.response';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
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
      throw new WsException(
        statusCodes[httpConstants.HTTP_STATUS_UNAUTHORIZED],
      );
    }

    return payload;
  }
}
