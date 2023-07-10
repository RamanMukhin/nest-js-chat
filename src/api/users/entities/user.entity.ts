import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserResponse } from '../responses/user.response';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop()
  _id: string;

  @Prop({ unique: true })
  login: string;

  @Prop()
  password: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  static getResponse(user: User): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rawUser } = user;
    return rawUser;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
