import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  login: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}
