import { ApiProperty } from '@nestjs/swagger';

export class FileResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  originalname: string;

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  destination: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
