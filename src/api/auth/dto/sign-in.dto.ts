import { ApiProperty } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';
import { IsDefined, IsString } from 'class-validator';

export class SignInDto extends SignUpDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  fingerprint: string;
}
