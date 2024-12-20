import {
  GamePlayersStates,
  GameRole,
  Player,
  PlayerState,
  PlayerStateUpdateOptions,
} from "../types";

import { useCustomQuery } from "./useCustomQuery.hook";

export const usePacman = () => {
  const { modifyPlayerState } = useCustomQuery();

  const scareGhosts = (
    gamePlayerStates: GamePlayersStates,
    gameId: string
  ): PlayerState => {
    const aliveGhosts: Player[] = Object.values(gamePlayerStates).filter(
      (player) =>
        player.role === GameRole.GHOST && player.state === PlayerState.ALIVE
    );
    console.log("alive ghosts to scare: ", aliveGhosts);
    changeAliveGhostState(aliveGhosts, gameId, PlayerState.SCARE);
    return PlayerState.SCARE;
  };

  const returnToNormalGhosts = (
    gamePlayerStates: GamePlayersStates,
    gameId: string
  ): PlayerState => {
    const scareGhosts: Player[] = Object.values(gamePlayerStates).filter(
      (player) =>
        player.role === GameRole.GHOST && player.state === PlayerState.SCARE
    );
    console.log("scare ghost returning to normal: ", scareGhosts);
    changeAliveGhostState(scareGhosts, gameId, PlayerState.ALIVE);
    return PlayerState.ALIVE;
  };

  const changeAliveGhostState = (
    aliveGhostsPlayerStates: Player[],
    gameId: string,
    state: PlayerState
  ) => {
    aliveGhostsPlayerStates.forEach((ghost) => {
      console.log(`Changing state of Ghost ${ghost.username}`);
      const modifyState: PlayerStateUpdateOptions = {
        playerId: String(ghost.id),
        gameId: gameId,
        state: String(state),
      };
      modifyPlayerState(modifyState);
    });
  };

  return {
    scareGhosts,
    returnToNormalGhosts,
  };
};
