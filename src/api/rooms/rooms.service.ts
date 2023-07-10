import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './entities/room.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RETURN_NEW_OPTION } from 'src/common/constants';
import { MessageResponse } from '../messages/responses/message.response';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  public async create(
    createRoomDto: CreateRoomDto,
    creatorId: string,
  ): Promise<Room> {
    const createdRoom = new this.roomModel({
      _id: new Types.ObjectId(),
      ...createRoomDto,
      creatorId,
      participants: [creatorId],
    });

    await createdRoom.save();

    return createdRoom;
  }

  public async findAll(paginationDto: PaginationDto): Promise<Room[]> {
    const page = (paginationDto.page && +paginationDto.page) || 1;
    const size = (paginationDto.size && +paginationDto.size) || 100;
    const offset = (page - 1) * size;

    const rooms = await this.roomModel.find().limit(size).skip(offset).exec();

    return rooms.map((room) => room.toObject());
  }

  public async findOne(
    id: string,
    paginationDto: PaginationDto = { page: '1', size: '1' },
  ): Promise<Room | (Room & { messages: MessageResponse[] })> {
    const page = (paginationDto.page && +paginationDto.page) || 1;
    const size = (paginationDto.size && +paginationDto.size) || 100;
    const offset = (page - 1) * size;

    const room = await this.roomModel
      .findById(id)
      .populate({
        path: 'messages',
        options: {
          limit: size,
          skip: offset,
        },
      })
      .exec();

    if (!room) {
      throw new NotFoundException(`Room with id=${id} not found`);
    }

    return room;
  }

  public async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id);

    const dataToUpdate: UpdateRoomDto = {
      name: updateRoomDto.name ?? room.name,
    };

    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, dataToUpdate, RETURN_NEW_OPTION)
      .exec();

    return updatedRoom;
  }

  public async remove(id: string): Promise<Room> {
    const deletedRoom = await this.roomModel
      .findByIdAndDelete({ _id: id })
      .exec();

    return deletedRoom;
  }
}
