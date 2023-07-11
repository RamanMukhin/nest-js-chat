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
