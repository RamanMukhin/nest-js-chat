import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './entities/room.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationDefault, RETURN_NEW_OPTION } from 'src/common/constants';
import { MessageResponse } from '../messages/responses/message.response';
import { getPagination } from 'src/common/utils';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  public async create(
    createRoomDto: CreateRoomDto,
    creatorId: string,
  ): Promise<Room> {
    const objectCreatorId = new Types.ObjectId(creatorId);
    const createdRoom = new this.roomModel({
      _id: new Types.ObjectId(),
      ...createRoomDto,
      creatorId: objectCreatorId,
      participants: [objectCreatorId],
    });

    await createdRoom.save();

    return createdRoom;
  }

  public async findAll(paginationDto: PaginationDto): Promise<Room[]> {
    const { limit, skip } = getPagination(paginationDto);

    const rooms = await this.roomModel.find().limit(limit).skip(skip).exec();

    return rooms.map((room) => room.toObject());
  }

  public async findRoomIdsByParticipantId(
    participantId: string,
  ): Promise<string[]> {
    const rooms = await this.roomModel
      .find({ participants: new Types.ObjectId(participantId) })
      .exec();

    return rooms.map((room) => room.toObject()._id);
  }

  public async findOne(
    id: string,
    paginationDto: PaginationDto = PaginationDefault,
  ): Promise<Room & { messages: MessageResponse[] }> {
    const { limit, skip } = getPagination(paginationDto);

    const room = await this.roomModel
      .findById(id)
      .populate({
        path: 'messages',
        options: {
          sort: { _id: -1 },
          limit,
          skip,
        },
      })
      .exec();

    if (!room) {
      throw new NotFoundException(`Room with id=${id} not found`);
    }

    return room.toObject();
  }

  public async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id);

    const dataToUpdate: UpdateRoomDto = {
      name: updateRoomDto.name ?? room.name,
    };

    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, dataToUpdate, RETURN_NEW_OPTION)
      .exec();

    return updatedRoom;
  }

  public async joinRoom(roomId: string, userId: string): Promise<Room> {
    const room = await this.roomModel.findById(roomId).exec();

    if (!room) {
      throw new NotFoundException(`Room with id=${roomId} not found`);
    }

    if (
      room
        .toObject()
        .participants.filter((userObjectId) => `${userObjectId}` === userId)
        .length
    ) {
      return room.toObject();
    }

    const dataToUpdate = {
      participants: [...room.participants, new Types.ObjectId(userId)],
    };

    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(roomId, dataToUpdate, RETURN_NEW_OPTION)
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
