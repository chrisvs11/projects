"use client";
import { useState } from "react";
import { myAudioProvider } from "../aux-classes";
import {
  GameItem,
  GameMap,
  GamePlayersStates,
  GameRole,
  GameState,
  pointsHash,
} from "../types";
import { useGameMap } from "./useGameMap.hook";
import { usePacman } from "./usePacman.hook";
import { useCollisionHandler } from "./useCollisionHandler.hook";

const POWER_UP_TIME: number = 10000;
const EXTEND_MUSIC_TIMER: number = 1500;

export const useGameUpdate = (gamePlayerState:GamePlayersStates) => {
  const { getMapTileItem } = useGameMap();
  const { scareGhosts, returnToNormalGhosts } = usePacman();
  const [powerTimerId, setPowerTimerId] = useState<NodeJS.Timeout>();
  const [frightTimerId, setFrightTimerId] = useState<NodeJS.Timeout>();
  const { getCaught } = useCollisionHandler();

  const startUpdate = (
    gameState: GameState,
    pacmanId: string,
    playerId: string,
    gameId: string,
    pacmanScoreUpdate: (points: number) => void,
    ghostScoreUpdate: (points: number) => void,
    getLatestGamePlayersState:() => GamePlayersStates,
    lives: number,
    currentGameMap: GameMap
  ) => {

    const playersState:GamePlayersStates = gamePlayerState
    //Early return when game is already ended
    if (gameState === GameState.END) {
      myAudioProvider.playGhostSirenSound(false);
      myAudioProvider.playGameOverMusic();
      console.log("Game Ended");
      return;
    }
    const { position: pPosition } = playersState[pacmanId];
    const item = getMapTileItem(pPosition, currentGameMap);
    const points: number = pointsHash[item];

    if (item === GameItem.POWER_UP) {
      startPowerUpSoundsLogic();
      //Pacman will send the signal to the backend
      if (pacmanId === playerId) {
        sendFrightSignal(POWER_UP_TIME, gameId,getLatestGamePlayersState);
      }
    }

    pacmanScoreUpdate(points);

    collisionChecker(
      playersState,
      pacmanId,
      gameId,
      lives,
      pacmanScoreUpdate,
      ghostScoreUpdate
    );
  };

  const startPowerUpSoundsLogic = (): boolean => {
    if (powerTimerId) clearTimeout(powerTimerId);

    myAudioProvider.playPowerUpSounds(POWER_UP_TIME);

    const powerUpTimer = setTimeout(() => {
      myAudioProvider.playFrightSound(false);
      myAudioProvider.playExtendMusic();
    }, POWER_UP_TIME - EXTEND_MUSIC_TIMER);
    setPowerTimerId(powerUpTimer);

    return true;
  };

  const sendFrightSignal = (
    frightTime: number,
    gameId: string,
    getLatestPlayersState:() => GamePlayersStates
  ) => { 
    if (frightTimerId) {
      clearTimeout(frightTimerId);
    } 

    scareGhosts(getLatestPlayersState(), gameId);
    const frightTimer = setTimeout(() => {
      console.log("game player State to before return to normal: ", getLatestPlayersState())
      returnToNormalGhosts(getLatestPlayersState(), gameId);
    }, frightTime);
    setFrightTimerId(frightTimer);
    return true;
  };

  const collisionChecker = (
    playersState: GamePlayersStates,
    pacmanId: string,
    gameId: string,
    lives: number,
    pacmanScoreUpdate: (points: number) => void,
    ghostScoreUpdate: (points: number) => void
  ): boolean => {
    const caught = getCaught(playersState, pacmanId, gameId, lives);
    switch (caught.player) {
      case GameRole.PACMAN:
        ghostScoreUpdate(caught.points);
        return true;
      case GameRole.GHOST:
        pacmanScoreUpdate(caught.points);
        return true;
      default:
        return false;
    }
  };

  return {
    startUpdate,
  };
};
