import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;
}
