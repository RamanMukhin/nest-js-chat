import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/api/users/entities/user.entity';
import { MessageTypesEnum } from '../enum/message-type.enum';
import { Room } from 'src/api/rooms/entities/room.entity';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ versionKey: false, timestamps: true })
export class Message extends Document {
  @Prop()
  _id: string;

  @Prop()
  type: MessageTypesEnum;

  @Prop({ type: SchemaTypes.ObjectId, ref: Room.name })
  roomId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  creatorId: string;

  @Prop()
  data: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
