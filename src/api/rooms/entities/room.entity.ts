import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/api/users/entities/user.entity';

export type RoomDocument = HydratedDocument<Room>;

@Schema({
  versionKey: false,
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false,
})
export class Room extends Document {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  creatorId: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: User.name })
  participants: string[];

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.virtual('messages', {
  ref: 'Message',
  foreignField: 'roomId',
  localField: '_id',
  justOne: false,
});

export { RoomSchema };
