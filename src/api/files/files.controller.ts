import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
  UseInterceptors,
  BadRequestException,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FilesService } from './files.service';
import { CreateFileDto, CreateFileQueryDto } from './dto/create-file.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestWithFile } from 'src/common/custom.request';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { getMulterConfigForFile } from 'src/common/utils';
import { MessagesService } from '../messages/messages.service';
import { MessageTypesEnum } from '../messages/enum/message-type.enum';
import { MessageResponse } from '../messages/responses/message.response';
import { JwtAuthGuard } from '../auth/utils/jwt-auth.quard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { File } from './entities/file.entity';
import { FileResponse } from './responses/file.response';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  @ApiOkResponse({ type: [MessageResponse] })
  @UseInterceptors(
    FileInterceptor(
      'file',
      getMulterConfigForFile(
        join(`${__dirname.replace(/dist.+/, 'storage')}`, 'files'),
      ),
    ),
  )
  @ApiHeader({ name: 'Content-Type', description: 'multipart/form-data' })
  @ApiBody({ schema: { example: { file: 'uploaded_file' } } })
  public async create(
    @Req() req: RequestWithFile,
    @Query() createFileQueryDto: CreateFileQueryDto,
  ): Promise<MessageResponse> {
    if (!req.file) {
      throw new BadRequestException('No file was sent');
    }

    const createdFileId = req.file.filename.split('_')[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fieldname, ...dataToCreate } = req.file;

    const fileData: CreateFileDto = {
      _id: new Types.ObjectId(createdFileId),
      creatorId: req.user._id,
      roomId: createFileQueryDto.roomId,
      ...dataToCreate,
    };

    await this.filesService.create(fileData);

    const message = await this.messagesService.create(
      {
        type: MessageTypesEnum.file,
        data: fileData.filename,
        roomId: createFileQueryDto.roomId,
      },
      req.user._id,
    );

    return message;
  }

  @Get()
  @ApiOkResponse({ type: [FileResponse] })
  public findAll(@Query() paginationDto: PaginationDto) {
    return this.filesService.findAll(paginationDto);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Res() res): Promise<void> {
    const readFileStream = await this.filesService.findOne(id);

    readFileStream.pipe(res);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@Param('id') id: string): Promise<File> {
    return this.filesService.remove(id);
  }
}
