import { Game } from 'src/api/game/model';

import { Player } from 'src/shared/types';
import { GameMapManager, Ghost, Pacman } from '../game-aux-classes';




export function  getFinalGameState(
    currentGameState: Game,
    pacman: Pacman,
    ghost: Ghost,
    mapControl: GameMapManager,
  ) {
    const pacPlayer = pacman.getPlayer();

    const ghostPlayers = ghost.getPlayers();

    const players: Player[] = currentGameState.players.map((player) => {
      if (player.id === pacPlayer.id) {
        return pacPlayer;
      } else {
        const ghostPlayer = ghostPlayers.find(
          (ghost) => ghost.id === player.id,
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

