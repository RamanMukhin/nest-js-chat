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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/utils/jwt-auth.quard';
import { RequestWithUser } from 'src/common/custom.request';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessageResponse } from './responses/message.response';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOkResponse({ type: MessageResponse })
  create(
    @Req() req: RequestWithUser,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageResponse> {
    return this.messagesService.create(createMessageDto, req.user._id);
  }

  @Get()
  @ApiOkResponse({ type: [MessageResponse] })
  findAll(@Query() paginationDto: PaginationDto): Promise<MessageResponse[]> {
    return this.messagesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: MessageResponse })
  findOne(@Param('id') id: string): Promise<MessageResponse> {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: MessageResponse })
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<MessageResponse> {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<MessageResponse> {
    return this.messagesService.remove(id);
  }
}
