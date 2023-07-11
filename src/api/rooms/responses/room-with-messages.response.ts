import { ApiProperty } from '@nestjs/swagger';
import { RoomResponse } from './room.response';
import { MessageResponse } from 'src/api/messages/responses/message.response';

export class RoomWithMessagesResponse extends RoomResponse {
  @ApiProperty({ type: [MessageResponse] })
  messages: MessageResponse[];
}
