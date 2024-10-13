"use client";

import {
  CollectionNames,
  Direction,
  Game,
  GameRole,
  GhostTypes,
  MapLayout,
  PacmanSprite,
  PlayerAvatar,
  PlayerState,
  useUsername,
} from "@/shared";

import FirebaseService from "@/shared/services/firebase-service";

import { useEffect, useRef, useState } from "react";

import styles from "./game.module.css";
import { useGameMoveQueueMutation } from "@/shared/services/tanstack-query";


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
  const { mutate: moveMutation } = useGameMoveQueueMutation({
    onSuccess: () => {
      console.log("Hello");
    },
    onError: () => {
      console.log("I failed");
    },
  });

  const createNPCGhost = (username: string): GhostTypes => {
    switch (username) {
      case GhostTypes.BLINKY:
        return GhostTypes.BLINKY;
      case GhostTypes.INKY:
        return GhostTypes.INKY;
      case GhostTypes.CLYDE:
        return GhostTypes.PINKY;
      case GhostTypes.PINKY:
        return GhostTypes.PINKY;
      default:
        return GhostTypes.BLINKY;
    }
  };

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

    return () => {
      unsubscribe();
      window.removeEventListener("keydown", eventListenerKeyDown);
    };
  }, []);

  return (
    <div className={styles.body}>
      <div className="card">
        <div className={styles.game_metadata}>
          <div style={{ color: "White" }}>currentUser: {currentUser}</div>
          <div className={styles.lives_container}>
            <PacmanSprite state={PlayerState.ALIVE} velocity={1 - 1 / 3} /> X{" "}
            {game?.lives! < 0 ? 0 : game?.lives}
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
          if (player.role === GameRole.PACMAN) {
            return (
              <PlayerAvatar
                positionX={MAP_OFFSET.OFFSET_X + col * TILE_WIDTH}
                positionY={MAP_OFFSET.OFFSET_Y + row * TILE_WIDTH}
                playerNum={playerNumber}
                state={player.state}
                direction={Direction.DOWN}
                scale={0.7}
              />
            );
          } else {
            return (
              <PlayerAvatar
                positionX={MAP_OFFSET.OFFSET_X + col * TILE_WIDTH}
                positionY={MAP_OFFSET.OFFSET_Y + row * TILE_WIDTH}
                playerNum={playerNumber}
                state={player.state}
                direction={Direction.DOWN}
                ghost
                scale={0.7}
                ghostType={createNPCGhost(player?.username)}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
