import { Module } from '@nestjs/common';

import { GameController } from './game.controller';

import { GameService } from './game.service';
import { GameStateManager } from 'src/game-aux-functions';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService,GameStateManager],
})
export class GameModule {}
