import { Model } from 'mongoose';
import { unlink } from 'node:fs/promises';
import { createReadStream, ReadStream } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './entities/file.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { getPagination } from 'src/common/utils';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
  ) {}

  async create(createFileDto: CreateFileDto): Promise<File> {
    const createdFile = new this.fileModel({
      ...createFileDto,
    });

    await createdFile.save();

    return createdFile.toObject();
  }

  public async findAll(paginationDto: PaginationDto): Promise<File[]> {
    const { limit, skip } = getPagination(paginationDto);

    const files = await this.fileModel.find().limit(limit).skip(skip).exec();

    return files.map((file) => file.toObject());
  }

  public async findOne(id: string): Promise<ReadStream> {
    const file = await this.fileModel.findById(id).exec();

    if (!file) {
      throw new NotFoundException(`File with id=${id} not found`);
    }

    return createReadStream(file.path);
  }

  public async remove(id: string): Promise<File> {
    const deletedFile = await this.fileModel
      .findByIdAndDelete({ _id: id })
      .exec();

    if (!deletedFile) {
      return null;
    }

    await unlink(deletedFile.path);

    return deletedFile;
  }
}
