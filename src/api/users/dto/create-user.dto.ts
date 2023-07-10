import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  login: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}
