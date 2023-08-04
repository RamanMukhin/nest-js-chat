import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('ws-jwt') {
  getRequest<T = any>(context: ExecutionContext): T {
    const socket: Socket = context.switchToWs().getClient();

    if (socket.handshake.auth.token) {
      socket.handshake.headers.authorization = socket.handshake.auth.token;
    }

    return socket.handshake as T;
  }
}
