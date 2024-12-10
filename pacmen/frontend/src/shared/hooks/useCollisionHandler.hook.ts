import { useCustomQuery } from ".";
import { myAudioProvider } from "../aux-classes";

import {
  CaughtData,
  GamePlayersStates,
  GameRole,
  GameState,
  PlayerState,
  Position,
} from "../types";

enum CAUGHT_POINTS {
  GHOST = 500,
  PACMAN = 1000,
}

export const useCollisionHandler = () => {

  const { modifyPlayerState,updateGameState } = useCustomQuery();
 
  const checkCollision = (
    position1: Position,
    position2: Position
  ) => {
    return (
      position1.row === position2.row &&
      position1.col === position2.col &&
      position1.row !== null &&
      position1.col !== null
    );
  };

  const getCaught = (
    playerStates: GamePlayersStates,
    pacmanId: string,
    gameId: string,
    lives:number
  ): CaughtData => {
    const pacmanState = playerStates[pacmanId];
    for (const key in playerStates) {
      if (key !== pacmanId && playerStates[key].position) {
        const ghostState = playerStates[key];

        const hasCollided: boolean = checkCollision(
          ghostState.position,
          pacmanState.position
        );

        if (!hasCollided) continue;

        if (ghostState.state === PlayerState.ALIVE) {
          console.log("Pacman Caught");
          modifyOnePlayerState(gameId, pacmanId, PlayerState.DEAD);
          if(lives <= 0) {
            updateGameState({
              gameId: gameId,
              state: String(GameState.END)
            })
          } else {
            updateGameState({
              gameId: gameId,
              state: String(GameState.RESTART)
            })
          }
          myAudioProvider.playDeathPacmanMusic();
          return { player: GameRole.PACMAN, points: CAUGHT_POINTS.PACMAN };
        }

        if (ghostState.state === PlayerState.SCARE) {
          console.log("Ghost Caught");
          myAudioProvider.playEatGhostSound();
          modifyOnePlayerState(gameId, key, PlayerState.DEAD);
          return { player: GameRole.GHOST, points: CAUGHT_POINTS.GHOST };
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
    getCaught,
  };
};
