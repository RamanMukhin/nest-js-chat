import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { MessageTypesEnum } from '../enum/message-type.enum';

export class CreateMessageDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  data: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsDefined()
  @IsEnum(MessageTypesEnum)
  type: MessageTypesEnum;
}
