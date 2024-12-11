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
  const { modifyPlayerState, updateGameState } = useCustomQuery();

  const checkCollision = (position1: Position, position2: Position) => {
    return (
      position1.row === position2.row &&
      position1.col === position2.col &&
      position1.row !== null &&
      position1.col !== null
    );
  };

  const pacmanCaughtHandler = async (
    lives: number,
    gameId: string,
    pacmanId: string
  ): Promise<CaughtData> => {
    console.log("pacman was caught");
    try {
      if (lives >= 1) {
        await updateGameState({
          gameId: gameId,
          state: String(GameState.RESTART),
        });
        return { player: GameRole.PACMAN, points: CAUGHT_POINTS.PACMAN };
      }
      await updateGameState({
        gameId: gameId,
        state: String(GameState.END),
      });
      await modifyPlayerState({
        playerId: pacmanId,
        gameId: gameId,
        state: String(PlayerState.DEAD),
      });

      myAudioProvider.playDeathPacmanMusic();
      return { player: GameRole.PACMAN, points: CAUGHT_POINTS.PACMAN };
    } catch (e) {
      console.error(e);
      return { player: null, points: 0 };
    }
  };

  const ghostCaughtHandler = async (
    ghostId: string,
    gameId: string
  ): Promise<CaughtData> => {
    try {
      console.log("Ghost Caught");
      myAudioProvider.playEatGhostSound();
      await modifyPlayerState({
        playerId: ghostId,
        gameId,
        state: String(PlayerState.DEAD),
      });
      return { player: GameRole.GHOST, points: CAUGHT_POINTS.GHOST };
    } catch (e) {
      console.error("error killing ghost", e);
      return { player: null, points: 0 };
    }
  };

  const caughtHandler = async (
    playerStates: GamePlayersStates,
    pacmanId: string,
    gameId: string,
    lives: number
  ): Promise<CaughtData> => {
    const { position: pacPosition } = playerStates[pacmanId];

    for (const key in playerStates) {
      if (key !== pacmanId && playerStates[key].position) {
        const { position, state } = playerStates[key];
        const hasCollided: boolean = checkCollision(position, pacPosition);
        if (!hasCollided) continue;

        switch (state) {
          case PlayerState.ALIVE:
            const pacmanCaughtData: CaughtData = await pacmanCaughtHandler(
              lives,
              gameId,
              pacmanId
            );
            return pacmanCaughtData;
          case PlayerState.SCARE:
            const ghostCaughtData = await ghostCaughtHandler(key, gameId);
            return ghostCaughtData;
          default:
            console.log("caught logic unknown");
            return { player: null, points: 0 };
        }
      }
    }
    return {player:null, points:0}
  };

  
  return {
    caughtHandler,
  };
};
