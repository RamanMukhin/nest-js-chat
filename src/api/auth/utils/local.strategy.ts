import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserResponse } from 'src/api/users/responses/user.response';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<UserResponse> {
    const userLoginDto = { login, password };

    const user = await this.authService.validateUser(userLoginDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
