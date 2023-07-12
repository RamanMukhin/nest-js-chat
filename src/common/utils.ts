import { join } from 'path';
import { Types } from 'mongoose';
import { Request } from 'express';
import { diskStorage, Options } from 'multer';
import { access, constants, mkdir } from 'node:fs/promises';
import { BadRequestException } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { MongoDbPagination } from './types';

export const getPagination = (
  paginationDto: PaginationDto,
): MongoDbPagination => {
  const page = (paginationDto.page && +paginationDto.page) || 1;
  const size = (paginationDto.size && +paginationDto.size) || 100;
  const offset = (page - 1) * size;

  return { limit: size, skip: offset };
};

const editFileName = () => {
  return async (
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, fileName: string) => void,
  ) => {
    const fileName = `${new Types.ObjectId()}_${file.originalname}`;

    callback(null, fileName.toString());
  };
};

const getDestinationFolder = (path: string) => {
  return async (
    req: Request,
    _file: Express.Multer.File,
    callback: (error: BadRequestException | null, destination?: string) => void,
  ) => {
    const { roomId } = req.query;

    if (!roomId) {
      callback(new BadRequestException('Parameter "roomId" is required'));
    }

    const destinationFolder = join(path, `${roomId}`);

    try {
      await access(destinationFolder, constants.R_OK | constants.W_OK);
    } catch {
      await mkdir(destinationFolder, { recursive: true });
      console.error('Created folder:  ', destinationFolder);
    }

    callback(null, destinationFolder);
  };
};

export const getMulterConfigForFile = (path: string): Options => {
  return {
    storage: diskStorage({
      destination: getDestinationFolder(path),
      filename: editFileName(),
    }),
  };
};
