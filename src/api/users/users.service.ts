import { Model, Types } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { RETURN_NEW_OPTION, SALT_ROUNDS } from '../../common/constants';
import { UserResponse } from './responses/user.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { mongoExistsType } from 'src/common/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async hashPassword(
    password: string,
    saltRounds = SALT_ROUNDS,
  ): Promise<string> {
    const salt = await genSalt(saltRounds);
    return hash(password, salt);
  }

  private async checkNewLogin(login: string) {
    const isLoginBusy = await this.ifUserExists(login);

    if (isLoginBusy) {
      throw new ForbiddenException('Desired login is busy');
    }
  }

  public async checkPassword(oldPassword: string, oldPasswordHash: string) {
    const isPermitted = await compare(oldPassword, oldPasswordHash);

    if (!isPermitted) {
      throw new ForbiddenException('Incorrect password');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    await this.checkNewLogin(createUserDto.login);

    const createdUser = new this.userModel({
      _id: new Types.ObjectId(),
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    });

    await createdUser.save();

    return User.getResponse(createdUser.toObject());
  }

  async findAll(paginationDto: PaginationDto): Promise<UserResponse[]> {
    const page = (paginationDto.page && +paginationDto.page) || 1;
    const size = (paginationDto.size && +paginationDto.size) || 100;
    const offset = (page - 1) * size;

    const users = await this.userModel.find().limit(size).skip(offset).exec();

    return users.map((user) => User.getResponse(user.toObject()));
  }

  async findOne<T = UserResponse | User>(
    id: string,
    toResponse = true,
  ): Promise<T> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return (toResponse ? User.getResponse(user.toObject()) : user) as T;
  }

  private async ifUserExists(login: string): Promise<mongoExistsType | null> {
    return this.userModel.exists({ login });
  }

  public async findOneByLogin(login: string): Promise<User | null> {
    const user = await this.userModel.findOne({ login }).exec();

    if (!user) {
      return null;
    }

    return user.toObject();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne<User>(id, false);

    const {
      oldPassword,
      password: newPassword,
      login: newLogin,
    } = updateUserDto;

    if (newPassword) {
      await this.checkPassword(oldPassword, user.password);
    }

    if (newLogin && newLogin !== user.login) {
      await this.checkNewLogin(newLogin);
    }

    const dataToUpdate: UpdateUserDto = {
      login: newLogin ? newLogin : user.login,
      password: newPassword
        ? await this.hashPassword(newPassword)
        : user.password,
    };

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, dataToUpdate, RETURN_NEW_OPTION)
      .exec();

    return User.getResponse(updatedUser.toObject());
  }

  async remove(id: string): Promise<UserResponse> {
    const deletedUser = await this.userModel
      .findByIdAndDelete({ _id: id })
      .exec();

    return User.getResponse(deletedUser.toObject());
  }
}
