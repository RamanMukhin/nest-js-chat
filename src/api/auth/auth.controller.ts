import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponse } from './responses/auth.response';
import { LocalAuthGuard } from './utils/local-auth.guard';
import { RequestWithUser } from 'src/common/custom.request';
import { JwtAuthGuard } from './utils/jwt-auth.quard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtRefreshAuthGuard } from './utils/jwt-refresh-auth.quard';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  public signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/sign-in')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: AuthResponse })
  @HttpCode(HttpStatus.OK)
  public signIn(@Request() req: RequestWithUser, @Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.fingerprint, req.user);
  }

  @ApiOkResponse({ type: AuthResponse })
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  public mobileRefresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: RequestWithUser,
  ): Promise<AuthResponse> {
    const refreshToken = req.headers.authorization.split(' ')[1];

    return this.authService.refresh(
      refreshTokenDto.fingerprint,
      req.user,
      refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  public logoutUser(
    @Req() req: RequestWithUser,
    @Body() logoutDto: LogoutDto,
  ): Promise<void> {
    return this.authService.logoutUser(logoutDto.fingerprint, req.user);
  }
}
