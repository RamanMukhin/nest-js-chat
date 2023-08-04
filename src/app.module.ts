import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from './api/rooms/rooms.module';
import { MessagesModule } from './api/messages/messages.module';
import { AppGateway } from './app.gateway';
import { FilesModule } from './api/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_HOST'),
      }),
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    MessagesModule,
    FilesModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
