import { Request } from 'express';
import { UserResponse } from '../api/users/responses/user.response';
import { jwtExpirationType } from './types';

export interface RequestWithUser extends Request {
  user?: UserResponse & jwtExpirationType;
}
