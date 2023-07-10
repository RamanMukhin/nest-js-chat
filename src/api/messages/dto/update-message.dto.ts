import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsDefined, IsString } from 'class-validator';

type UpdateMessageType = Pick<CreateMessageDto, 'data'>;

class UpdateMessage implements UpdateMessageType {
  @ApiProperty()
  @IsDefined()
  @IsString()
  data: string;
}

export class UpdateMessageDto extends PartialType(UpdateMessage) {}
