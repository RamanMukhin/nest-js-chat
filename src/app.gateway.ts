import { constants as httpConstants } from 'http2';
import { STATUS_CODES as statusCodes } from 'http';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { UsersService } from './api/users/users.service';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './api/rooms/rooms.service';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsJwtAuthGuard } from './api/auth/utils/ws-jwt-auth-guard';
import { MessagesService } from './api/messages/messages.service';
import { MessageTypesEnum } from './api/messages/enum/message-type.enum';
import { AuthService } from './api/auth/auth.service';
import { CreateMessageDto } from './api/messages/dto/create-message.dto';

@UseGuards(WsJwtAuthGuard)
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly uusersService: UsersService,
    private readonly authService: AuthService,
    private readonly roomsService: RoomsService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    const authHeader: string = client.handshake?.headers?.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      client.disconnect();
    }

    try {
      const payload = await this.authService.validateToken(token);

      if (!(payload && payload.login)) {
        client.disconnect();
      }

      const user = await this.uusersService.findOneByLogin(payload.login);

      if (!user) {
        client.disconnect();
      }

      const roomIds = await this.roomsService.findRoomIdsByParticipantId(
        user._id,
      );

      await client.join(roomIds);
    } catch (err) {
      console.log(err);
      throw new WsException(
        statusCodes[httpConstants.HTTP_STATUS_UNAUTHORIZED],
      );
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnected:     ', client.id);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async send(client: Socket, createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(
      {
        data: createMessageDto.data,
        roomId: createMessageDto.roomId,
        type: MessageTypesEnum.text,
      },
      (client.handshake as any).user._id,
    );

    this.server.to(createMessageDto.roomId).emit('newMessage', message);
  }
}
