import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from './api/rooms/rooms.module';
import { MessagesModule } from './api/messages/messages.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_HOST),
    AuthModule,
    UsersModule,
    RoomsModule,
    MessagesModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
