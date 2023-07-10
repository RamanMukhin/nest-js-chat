import { ApiProperty } from '@nestjs/swagger';
import { MessageTypesEnum } from '../enum/message-type.enum';

export class MessageResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty({ enum: MessageTypesEnum })
  type: MessageTypesEnum;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty({ type: String, example: '2023-07-10T07:34:32.959Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-07-10T07:34:32.959Z' })
  updatedAt: string;
}
