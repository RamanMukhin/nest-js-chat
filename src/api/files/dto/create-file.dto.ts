import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFileDto {
  _id: Types.ObjectId;

  roomId: string;

  creatorId: string;

  filename: string;

  originalname: string;

  encoding: string;

  mimetype: string;

  destination: string;

  path: string;

  size: number;
}

export class CreateFileQueryDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  roomId: string;
}
