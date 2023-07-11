import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/utils/jwt-auth.quard';
import { RequestWithUser } from 'src/common/custom.request';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RoomResponse } from './responses/room.response';
import { RoomWithMessagesResponse } from './responses/room-with-messages.response';

@ApiTags('rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOkResponse({ type: RoomResponse })
  create(
    @Req() req: RequestWithUser,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<RoomResponse> {
    return this.roomsService.create(createRoomDto, req.user._id);
  }

  @Get()
  @ApiOkResponse({ type: [RoomResponse] })
  findAll(@Query() paginationDto: PaginationDto): Promise<RoomResponse[]> {
    return this.roomsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: RoomWithMessagesResponse })
  findOne(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<RoomWithMessagesResponse> {
    return this.roomsService.findOne(id, paginationDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: RoomResponse })
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<RoomResponse> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<RoomResponse> {
    return this.roomsService.remove(id);
  }
}
