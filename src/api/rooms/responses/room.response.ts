import { ApiProperty } from '@nestjs/swagger';

export class RoomResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  participants: string[];

  @ApiProperty({ type: String, example: '2023-07-10T07:34:32.959Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-07-10T07:34:32.959Z' })
  updatedAt: string;
}
