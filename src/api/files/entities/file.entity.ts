import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/api/users/entities/user.entity';
import { Room } from 'src/api/rooms/entities/room.entity';

export type FileDocument = HydratedDocument<File>;

@Schema({ versionKey: false, timestamps: true })
export class File extends Document {
  @Prop()
  _id: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Room.name, required: true })
  roomId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  creatorId: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalname: string;

  @Prop({ required: true })
  encoding: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  size: number;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
