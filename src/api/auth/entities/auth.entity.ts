import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ versionKey: false, timestamps: true })
export class Auth extends Document {
  @Prop()
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  fingerprint: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.index({ userId: 1, fingerprint: 1 }, { unique: true });

export { AuthSchema };
