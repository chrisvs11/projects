"use client";

import {
  CollectionNames,
  Direction,
  Game,
  GameRole,
  MapLayout,
  PacmanSprite,
  PlayerAvatar,
  PlayerState,
  useTimer,
  useUsername,
} from "@/shared";

import FirebaseService from "@/shared/services/firebase-service";

import { useEffect, useRef, useState } from "react";

import styles from "./game.module.css";

import { useGameMoveQueueMutation } from "@/shared/hooks/mutate-game.hook";

const firebaseService = new FirebaseService();

const MAP_OFFSET = {
  OFFSET_X: 30,
  OFFSET_Y: 75,
};

const TILE_WIDTH: number = 20;

export default function Page({
  params,
}: {
  params: { lobbyId: string; gameId: string };
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [game, setGame] = useState<Game>();
  const { username: currentUser } = useUsername();
  const {timer,startTimer,clearTimer} = useTimer(game?.playtime)
  const { mutate: moveMutation } = useGameMoveQueueMutation({
    onSuccess: () => {
      console.log("Hello");
    },
    onError: () => {
      console.log("I failed");
    },
  });

  const eventListenerKeyDown = (e: KeyboardEvent) => {
    const keyToDirection: { [key: string]: Direction } = {
      ArrowUp: Direction.UP,
      ArrowDown: Direction.DOWN,
      ArrowLeft: Direction.LEFT,
      ArrowRight: Direction.RIGHT,
    };

    const direction = keyToDirection[e.key];
    console.log(direction);

    if (direction) {
      moveMutation({
        playerNumber: 1,
        gameId: params.gameId,
        direction: direction,
      });
    }
  };

  useEffect(() => {
    const { unsubscribe } = firebaseService.getRealTimeDocument(
      CollectionNames.GAMES,
      params.gameId,
      (data: Game) => setGame(data)
    );
    window.addEventListener("keydown", eventListenerKeyDown);
    startTimer()

    return () => {
      unsubscribe();
      window.removeEventListener("keydown", eventListenerKeyDown);
      clearTimer()
    };
  }, []);

  return (
    <div className={styles.body}>
      <div className="card">
        <div className={styles.game_metadata}>
          <div className={styles.lives_container}>
            <PacmanSprite state={PlayerState.ALIVE} velocity={1 - 1 / 3} /> X{" "}
            {/* <div>{game?.lives! < 0 ? 0 : game?.lives}</div> */}
            <div>Time:{timer} vs  firebaseTime: {game?.time}</div>
          </div>
          <div className={styles.lives_container}>
            Pacman Score: {game?.pacmanScore} pts
          </div>
          <div className={styles.lives_container}>
            Ghost Score: {game?.ghostScore} pts
          </div>
        </div>
        {game && (
          <div ref={parentRef}>
            <MapLayout gameMap={game.map} tilesHeight={TILE_WIDTH} />
          </div>
        )}
        {game?.players.map((player, index) => {
          const playerNumber: number = index + 1;
          const playerCoordinate: number =
            player.movement.coordinates.current || 0;
          const { row, col } = game.map.cells[playerCoordinate];
          const dir = player.movement.direction;

          console.log(
            `${player.username}, ${playerNumber},state:${player.state}`
          );

          const hashRotation: { [key: string]: number } = {
            right: 0,
            down: 90,
            left: 180,
            up: 270,
          };

          if (player.role === GameRole.PACMAN) {
            return (
              <PlayerAvatar
                positionX={MAP_OFFSET.OFFSET_X + col * TILE_WIDTH}
                positionY={MAP_OFFSET.OFFSET_Y + row * TILE_WIDTH}
                playerNum={playerNumber}
                state={player.state}
                scale={0.7}
                rotation={hashRotation[dir]}
              />
            );
          }
          if (player.role === GameRole.GHOST)
            return (
              <PlayerAvatar
                positionX={MAP_OFFSET.OFFSET_X + col * TILE_WIDTH}
                positionY={MAP_OFFSET.OFFSET_Y + row * TILE_WIDTH}
                playerNum={playerNumber}
                state={player.state}
                direction={dir}
                ghost
                scale={0.7}
                ghostName={player.username}
              />
            );
        })}
      </div>
    </div>
  );
}
