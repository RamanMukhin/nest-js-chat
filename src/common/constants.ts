import { QueryOptions } from 'mongoose';
import { PaginationDto } from './dto/pagination.dto';

export const SALT_ROUNDS = 10;

export const RETURN_NEW_OPTION: QueryOptions = { new: true };

export const PaginationDefault: PaginationDto = { page: '1', size: '1' };
