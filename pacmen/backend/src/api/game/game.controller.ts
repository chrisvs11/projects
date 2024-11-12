import { Post, Param, Patch, Controller } from '@nestjs/common';

import { GameService } from './game.service';

import { GameDirectionInput, GameStartInput } from './dto';

import { Game } from './model';
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post(':lobbyId')
  async create(@Param() params: GameStartInput): Promise<Game> {
    return this.gameService.create(params);
  }

  @Patch(':gameId/:playerId/:direction')
  async putMoveToQueue(
    @Param() { gameId, playerId, direction }: GameDirectionInput,
  ) {
    return this.gameService.putMoveToQueue(
      direction,
      parseInt(playerId),
      gameId,
    );
  }
}
