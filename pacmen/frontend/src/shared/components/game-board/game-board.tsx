"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import {
  Direction,
  GameMap,
  GamePlayersStates,
  GameRole,
  GameState,
  MoveVector,
  Player,
  Position,
} from "@/shared/types";

import { DirectionCard, GameController, MapLayout, PlayerAvatar } from "..";

import styles from "./game-board.module.css";

import { PlayerAssistant } from "@/shared/aux-classes";

import { useCustomQuery, useGameUpdate, useScoreTracker } from "@/shared/hooks";

interface GameBoardProps {
  waitTime: number;
  gameId: string;
  players: Player[];
  pacmanId: string;
  gameState: GameState;
  playerId: string;
  lives: number;
  gameMap: GameMap;
  gamePlayerStates: GamePlayersStates;
  time: number;
}
const TILE_WIDTH: number = 21;

const FPS: number = 60 / 15;

const MAP_OFFSET_PACMEN = {
  X: -TILE_WIDTH * 0.1,
  Y: -TILE_WIDTH * 0.4,
};

const MAP_OFFSET_GHOSTS = {
  X: -TILE_WIDTH * 0.5,
  Y: -TILE_WIDTH * 0.4,
};
const localPlayerAssistant: PlayerAssistant = new PlayerAssistant();

const KEY_TO_DIRECTION: { [key: string]: Direction } = {
  ArrowUp: Direction.UP,
  ArrowDown: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
};
const DIRECTION_COLD_DOWN_TIME: number = 200;

export const GameBoard: FC<GameBoardProps> = ({
  waitTime,
  gameId,
  pacmanId,
  gameState,
  playerId,
  gameMap,
  lives,
  gamePlayerStates,
  players,
}) => {
  const [tileWidth, setTileWidth] = useState<number>(TILE_WIDTH);
  const signalBlockRef = useRef(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const directionInCoolDown = useRef(false);
  const frameCountRef = useRef(0);
  const gamePlayerStateRef = useRef<GamePlayersStates>(gamePlayerStates);
  const gameStateRef = useRef<GameState>(gameState);
  const gameMapRef = useRef<GameMap>(gameMap);
  const { sendMove } = useCustomQuery();
  const { startUpdate } = useGameUpdate(gamePlayerStateRef.current);
  const { addPointsToGhosts, addPointsToPacman } = useScoreTracker();

  const eventListenerKeyDown = (e: KeyboardEvent) => {
    console.log("arrow pressed", e.key);

    //Lock the direction listener
    if (directionInCoolDown.current) return;
    const inputDirection: Direction = KEY_TO_DIRECTION[e.key];

    //No valid direction input
    if (!inputDirection) return;

    localPlayerAssistant.addNewDirection(inputDirection);

    directionInCoolDown.current = true;
    setTimeout(() => {
      directionInCoolDown.current = false;
    }, DIRECTION_COLD_DOWN_TIME);
  };


  const moveActivePlayer = async (
    player: Player,
    gameMap: GameMap,
    gameState: GameState
  ) => {
    if (signalBlockRef.current || gameState !== GameState.ON_GOING) {
      return;
    }
    
    const nextPosition: Position = localPlayerAssistant.getPlayerNextPosition(
      gameState,
      player,
      gameMap
    );

    const moveVector: MoveVector = {
      position: nextPosition,
      direction: localPlayerAssistant.getDirection(0) || Direction.RIGHT,
    };

    await sendMove({
      playerNumber: playerId,
      gameId,
      move: moveVector,
    });
  };

  const resize = useCallback(() => {
    console.log("Resizing...");
    setWindowWidth(window.innerWidth);
  }, [window.innerWidth]);

  const getLatestGamePlayersState = (): GamePlayersStates => {
    return gamePlayerStateRef.current;
  };

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (!gameMap || !gamePlayerStates) return;

    gamePlayerStateRef.current = gamePlayerStates;

    gameMapRef.current = gameMap;

    startUpdate(
      gameState,
      String(pacmanId),
      playerId,
      gameId,
      addPointsToPacman,
      addPointsToGhosts,
      getLatestGamePlayersState,
      lives,
      gameMap
    );
  }, [gamePlayerStates, gameMap, lives]);

  useEffect(() => {
    const newTileWidth =
      windowWidth >= 1100 ? TILE_WIDTH : windowWidth >= 600 ? 18 : 12;
    setTileWidth(newTileWidth);
  }, [windowWidth]);

  useEffect(() => {
    let animationFrameId: number;

    const renderFrame = async () => {
      frameCountRef.current += 1;
      if (frameCountRef.current % FPS === 0) {
        const localPlayerState: Player | undefined =
          gamePlayerStateRef.current[playerId];
        await moveActivePlayer(
          localPlayerState,
          gameMapRef.current,
          gameStateRef.current
        );
      }
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    window.addEventListener("resize", resize);
    setWindowWidth(window.innerWidth);

    const timer = setTimeout(() => {
      console.log("Start Game");
      window.addEventListener("keydown", eventListenerKeyDown);
      renderFrame(); // Start the animation frame loop after the delay
    }, waitTime);

    return () => {
      console.log("eliminating animation frame");
      window.removeEventListener("keydown", eventListenerKeyDown);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.parent} id="parent">
      <div className={styles.direction_container}>
        <DirectionCard
          currentDirection={localPlayerAssistant.getDirection(0)}
          nextDirection={localPlayerAssistant.getDirection(1)}
        />
      </div>
      <div>
        {gameMap && <MapLayout gameMap={gameMap} tilesHeight={tileWidth} />}
      </div>
      <div>
        {gamePlayerStates &&
          gameMap &&
          players.map((player: Player) => {
            const playerStat = gamePlayerStates[String(player.id)];
            const commonProps = {
              offsetX:
                player.role === GameRole.GHOST
                  ? MAP_OFFSET_GHOSTS.X
                  : MAP_OFFSET_PACMEN.X,
              offsetY:
                player.role === GameRole.GHOST
                  ? MAP_OFFSET_GHOSTS.Y
                  : MAP_OFFSET_PACMEN.Y,
              playerNum: player.id,
              ghostType: player.type,
              role: player.role,
            };
            return (
              <PlayerAvatar
                {...commonProps}
                key={player.id}
                tileWidth={TILE_WIDTH}
                position={playerStat.position}
                state={playerStat.state}
                direction={playerStat.direction || Direction.RIGHT}
                className={styles.avatar}
                scale={(0.8 * tileWidth) / TILE_WIDTH}
              />
            );
          })}
      </div>
      {/* <Button
        btnText={`${signalBlockRef.current ? "unblock" : "block"}`}
        cKBtn
        className={`${styles.signal_btn}`}
        onClick={() => toggleSignalBlock()}
      /> */}
      <div className={styles.controller}>
        <GameController
          onClick={(direction:Direction) => localPlayerAssistant.addNewDirection(direction)}
        />
      </div>
    </div>
  );
};
