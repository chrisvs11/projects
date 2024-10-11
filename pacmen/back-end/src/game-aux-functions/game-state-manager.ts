import { Injectable } from '@nestjs/common';
import { Game } from 'src/api/game/model';
import { Player } from 'src/shared/types';
import { GameMapManager, Ghost, Pacman } from '.';

@Injectable()
export class GameStateManager {
  constructor() {}

  getFinalGameState(
    currentGameState: Game,
    pacman: Pacman,
    ghost: Ghost,
    mapControl: GameMapManager,
  ) {
    const pacPlayer = pacman.getPlayer();

    const ghostPlayers = ghost.getPlayers();

    const players: Player[] = currentGameState.players.map((player) => {
      if (player.uuid === pacPlayer.uuid) {
        return pacPlayer;
      } else {
        const ghostPlayer = ghostPlayers.find(
          (ghost) => ghost.uuid === player.uuid,
        );
        return ghostPlayer;
      }
    });

    return {
      map: mapControl.getGameMap(),
      players: players,
      ghostScore: ghost.getScore(),
      pacmanScore: pacman.getScore(),
      lives: pacman.getLives(),
    };
  }
}
