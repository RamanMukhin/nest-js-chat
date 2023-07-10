import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RETURN_NEW_OPTION } from 'src/common/constants';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly roomsService: RoomsService,
  ) {}

  private async checkRoom(roomId: string): Promise<void> {
    try {
      await this.roomsService.findOne(roomId);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new BadRequestException(err.message);
      }

      throw err;
    }
  }

  public async create(
    createMessageDto: CreateMessageDto,
    creatorId: string,
  ): Promise<Message> {
    await this.checkRoom(createMessageDto.roomId);

    const createdMessage = new this.messageModel({
      _id: new Types.ObjectId(),
      creatorId,
      ...createMessageDto,
    });

    await createdMessage.save();

    return createdMessage;
  }

  public async findAll(paginationDto: PaginationDto): Promise<Message[]> {
    const page = (paginationDto.page && +paginationDto.page) || 1;
    const size = (paginationDto.size && +paginationDto.size) || 100;
    const offset = (page - 1) * size;

    const messages = await this.messageModel
      .find()
      .limit(size)
      .skip(offset)
      .exec();

    return messages.map((message) => message.toObject());
  }

  public async findOne(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();

    if (!message) {
      throw new NotFoundException(`Message with id=${id} not found`);
    }

    return message;
  }

  public async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);

    const dataToUpdate: UpdateMessageDto = {
      data: updateMessageDto.data ?? message.data,
    };

    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(id, dataToUpdate, RETURN_NEW_OPTION)
      .exec();

    return updatedMessage;
  }

  public async remove(id: string): Promise<Message> {
    const deletedMessage = await this.messageModel
      .findByIdAndDelete({ _id: id })
      .exec();

    return deletedMessage;
  }
}
