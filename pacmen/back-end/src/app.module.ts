import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { FirebaseModule } from './shared/services';

import { ConfigModule } from './shared/config';

import { GameModule, LobbyModule, MapModule, UserModule } from './api';

@Module({
  imports: [ConfigModule, FirebaseModule, UserModule, GameModule, LobbyModule, MapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
