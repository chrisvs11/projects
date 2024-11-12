import { useCustomQuery } from ".";
import { GameAudios } from "../aux-classes";

import {
  CaughtData,
  Coordinates,
  GamePlayerStates,
  GameState,
  PlayerState,
} from "../types";

enum CAUGHT_POINTS {
  GHOST = 500,
  PACMAN = 1000,
}

export const useCollisionHandler = () => {
  const gameAudios = new GameAudios()
  const { modifyPlayerState,updateGameState } = useCustomQuery();
 
  const checkCollision = (
    coordinates1: Coordinates,
    coordinates2: Coordinates
  ) => {
    return (
      coordinates1.row === coordinates2.row &&
      coordinates1.col === coordinates2.col &&
      coordinates1.row !== null &&
      coordinates1.col !== null
    );
  };

  const collisionHandler = (
    playerStates: GamePlayerStates,
    pacmanId: string,
    gameId: string,
  ): CaughtData => {
    const pacmanState = playerStates[pacmanId];
    for (const key in playerStates) {
      if (key !== pacmanId && playerStates[key].next) {
        const ghostState = playerStates[key];

        const hasCollided: boolean = checkCollision(
          ghostState.next,
          pacmanState.next
        );

        if (!hasCollided) continue;

        if (ghostState.state === PlayerState.ALIVE) {
          console.log("Pacman Caught");
          modifyOnePlayerState(gameId, pacmanId, PlayerState.DEAD);
          updateGameState({
            gameId: gameId,
            state: String(GameState.RESTART)
          })
          gameAudios.deathPacmanMusicStart();
          return { player: "pacman", points: CAUGHT_POINTS.PACMAN };
        }

        if (ghostState.state === PlayerState.SCARE) {
          console.log("Ghost Caught");
          gameAudios.eatGhostMusicStart();
          modifyOnePlayerState(gameId, key, PlayerState.DEAD);
          return { player: "ghost", points: CAUGHT_POINTS.GHOST };
        }
      }
    }
    return { player: null, points: 0 };
  };

  const modifyOnePlayerState = (
    gameId: string,
    playerId: string,
    state: PlayerState
  ) => {
    console.log(`Modifying Player ${playerId} to ${state}`)
    modifyPlayerState({
      playerId,
      gameId,
      state: String(state),
    });
  };

  return {
    collisionHandler,
  };
};
