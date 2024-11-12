"use client";
import FirebaseService from "@/shared/services/firebase-service";

import { useEffect, useRef, useState } from "react";

import styles from "./game.module.css";

import { useRouter } from "next/navigation";

import {
  CollectionNames,
  Direction,
  Game,
  GameItem,
  GamePlayerStates,
  GameState,
  Player,
  PlayerState,
  pointsHash,
} from "@/shared/types";

import {
  useCollisionHandler,
  useCustomQuery,
  useGame,
  useLobbyId,
  useMapLayout,
  usePacman,
  usePlayer,
} from "@/shared/hooks";

import {
  Button,
  GhostsWinSlider,
  MapLayout,
  PacmanSprite,
  PacmanWinSlider,
  PlayerAvatar,
  TieSlider,
} from "@/shared/components";

import { GameAudios } from "@/shared/aux-classes";

const firebaseService = new FirebaseService();

const TILE_WIDTH: number = 20;

const MAP_OFFSET = {
  X: -TILE_WIDTH * 0.2,
  Y: -TILE_WIDTH * 0.2,
};

const WAIT_FRAMES: number = 10;

const POWER_UP_TIME: number = 15000;

const keyToDirection: { [key: string]: Direction } = {
  ArrowUp: Direction.UP,
  ArrowDown: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
};

export default function Page({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const gameAudios = new GameAudios();
  const frameCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevPositionRef = useRef<{ [key: string]: Player }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [pacmanScore, setPacmanScore] = useState<number>(0);
  const [ghostScore, setGhostScore] = useState<number>(0);
  const [gamePlayerStates, setGamePlayerStates] = useState<GamePlayerStates>();
  const latestGamePlayerStateRef = useRef(gamePlayerStates);
  const { game, setGame } = useGame();
  const {
    gameMap,
    mapTiles,
    setMapTiles,
    getMapTileItem,
    getRecCoordinatesOfElementById,
  } = useMapLayout();
  const { lobbyId, setLobbyId } = useLobbyId();
  const {
    direction,
    setDirection,
    getNextCoordinates,
    playerId,
    player,
    setPlayer,
    setPlayerId,
  } = usePlayer();
  const { scareGhosts, returnToNormalGhosts } = usePacman();
  const { moveYourAvatar, leaveLobby } = useCustomQuery();
  const { collisionHandler } = useCollisionHandler();
  const [tileWidth, setTileWidth] = useState<number>(TILE_WIDTH);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const router = useRouter();

  const eventListenerKeyDown = (e: KeyboardEvent) => {
    setDirection(keyToDirection[e.key]);
  };

  const exitHandler = () => {
    console.log("Exiting Game...");

    if (player && lobbyId) {
      leaveLobby({
        username: player.username,
        lobbyId: lobbyId,
      });
    }

    setLobbyId(null);
    setPlayer(null);
    setPlayerId("");
    gameAudios.ghostSirenMusicStop();

    router.push("/");
  };

  const restartHandler = () => {
    if (game) router.push(`/lobby/${game.lobbyId}`);
  };

  useEffect(() => {
    if (!gameMap || !gamePlayerStates || !direction || !game) return;

    if (!player) {
      setPlayer(game.players[parseInt(playerId) - 1]);
    }

    if (game.gameState === GameState.END) return;

    let animationFrameId: number;

    if (gameMap && direction) {
      const renderFrame = () => {
        frameCountRef.current += 1;
        if (frameCountRef.current % WAIT_FRAMES === 0) {
          if (game?.gameState === GameState.RESTART) {
            gameAudios.ghostSirenMusicStop();
            if (game.lives >= 0) gameAudios.startGameMusic();
            console.log(
              "next:",
              gamePlayerStates[playerId].next,
              "start:",
              gamePlayerStates[playerId].start
            );
            if (
              gamePlayerStates[playerId].next !==
              gamePlayerStates[playerId].start
            ) {
              moveYourAvatar({
                playerNumber: playerId,
                gameId: gameId,
                move: {
                  next: gamePlayerStates[playerId].start,
                  direction: direction,
                },
              });
            }
          } else if (
            game?.gameState === GameState.ON_GOING &&
            game.lives >= 0
          ) {
            gameAudios.ghostSirenMusicStart();
            const currentCoordinates = gamePlayerStates[playerId].next;
            const nextCoordinates = getNextCoordinates(
              currentCoordinates,
              gameMap
            );

            if (nextCoordinates !== currentCoordinates && direction) {
              moveYourAvatar({
                playerNumber: playerId,
                gameId: gameId,
                move: {
                  next: nextCoordinates,
                  direction,
                },
              });
            }
          }
        }

        animationFrameId = requestAnimationFrame(renderFrame);
      };

      animationFrameId = requestAnimationFrame(renderFrame);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMap, direction, gamePlayerStates, game]);

  const errorFn = () => {
    router.push("404");
  };

  useEffect(() => {
    if (!game || !gamePlayerStates || !mapTiles) return;

    latestGamePlayerStateRef.current = gamePlayerStates;

    if (game.gameState === GameState.END) {
      gameAudios.stopAllMusic();
      gameAudios.ghostSirenMusicStop();
    }

    const currentPositions = Object.fromEntries(
      Object.entries(gamePlayerStates).map(([id, next]) => [id, next])
    );
    const hasPositionChange = Object.keys(currentPositions).some(
      (key) => prevPositionRef.current[key] !== currentPositions[key]
    );
    if (hasPositionChange) {
      const pacmanState = gamePlayerStates[String(game.pacmanId)];

      //Item Handler Phase
      const item = getMapTileItem(pacmanState.next, mapTiles);
      let points: number = pointsHash[item || GameItem.EMPTY];
      if (item === GameItem.POWER_UP && String(game.pacmanId) === playerId) {
        gameAudios.playPowerUpSounds(POWER_UP_TIME);
        scareGhosts(gamePlayerStates, game.id);

        if (timerRef.current) clearTimeout(timerRef.current);

        const timerId = setTimeout(() => {
          if (latestGamePlayerStateRef.current) {
            returnToNormalGhosts(latestGamePlayerStateRef.current, gameId);
          }
        }, POWER_UP_TIME);

        timerRef.current = timerId;
      }
      setPacmanScore((prev) => prev + points);

      //Collision Handler
      const caught = collisionHandler(
        gamePlayerStates,
        String(game.pacmanId),
        game.id
      );

      if (caught.player === "pacman") {
        setGhostScore((prev) => prev + caught.points);
      } else {
        points += caught.points;
      }
      if (points > 0) {
        setPacmanScore((prev) => prev + points);
      }

      prevPositionRef.current = currentPositions;
    }
  }, [gamePlayerStates, game, mapTiles]);

  useEffect(() => {
    const newTileWidth =
      windowWidth >= 1000 ? TILE_WIDTH : windowWidth >= 600 ? 15 : 10;
    setTileWidth(newTileWidth);
  }, [windowWidth]);

  useEffect(() => {
    const gameSubscription = firebaseService.getRealTimeDocument(
      CollectionNames.GAMES,
      gameId,
      (data: Game) => setGame(data),
      () => errorFn()
    );

    const movesSubscription = firebaseService.getRealTimeDocument(
      CollectionNames.STATS,
      gameId,
      (data: GamePlayerStates) => setGamePlayerStates(data),
      () => errorFn()
    );

    if (gameMap) setMapTiles(gameMap.tiles);

    window.addEventListener("keydown", eventListenerKeyDown);
    setLoading(false);

    gameAudios.startGameMusic();
    gameAudios.introSongMusicStop();
    setTimeout(() => {
      gameAudios.ghostSirenMusicStart();
    }, 5000);

    function resize() {
      setWindowWidth(window.innerWidth);
    }

    setWindowWidth(window.innerWidth)

    window.addEventListener("resize", resize);

    return () => {
      gameSubscription();
      movesSubscription();
      window.removeEventListener("keydown", eventListenerKeyDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={styles.body}>
      {!loading &&
        game?.gameState !== GameState.END &&
        game &&
        game.lives >= 0 && (
          <div className={`card ${styles.card}`}>
            <div className={styles.game_metadata}>
              <div className={styles.game_stats_card}>
                <PacmanSprite state={PlayerState.ALIVE} velocity={1 - 1 / 3} />
                <p>x{game?.lives < 0 ? 0 : game?.lives}</p>
              </div>
              <div className={styles.game_stats_card}>
                Pacman Score: {pacmanScore} pts
              </div>
              <div className={styles.game_stats_card}>
                Ghost Score: {ghostScore} pts
              </div>
              <div className={styles.game_stats_card}>
                Timer: {Math.max(game?.playtime, 0)} s
              </div>
            </div>
            <div
              className={styles.parent}
              id="parent"
              style={{ position: "relative" }}
            >
              {gameMap && mapTiles && (
                <MapLayout
                  mapTiles={mapTiles}
                  tilesHeight={tileWidth}
                  rows={gameMap.rows}
                  cols={gameMap.cols}
                />
              )}
              {gamePlayerStates &&
                gameMap &&
                mapTiles &&
                game?.players.map((player) => {
                  const playerStat = gamePlayerStates[String(player.id)];
                  const commonProps = {
                    offsetX: MAP_OFFSET.X,
                    offsetY: MAP_OFFSET.Y,
                    playerNum: player.id,
                    ghostType: player.type,
                    role: player.role,
                    scale: 0.7,
                    coordinatesToRecCoordinates: () =>
                      getRecCoordinatesOfElementById(
                        playerStat.next,
                        TILE_WIDTH
                      ),
                    mapTiles: mapTiles,
                    cols: gameMap.cols,
                  };

                  return (
                    <PlayerAvatar
                      key={player.id}
                      {...commonProps}
                      coordinates={playerStat.next}
                      state={playerStat.state}
                      direction={playerStat.direction || Direction.RIGHT}
                      className={styles.avatar}
                    />
                  );
                })}
            </div>
          </div>
        )}
      {!loading && game && game.gameState === GameState.END && (
        <div className={styles.gameOver_card}>
          <p>GAME OVER</p>
          <p>
            {game.lives < 0 ? (
              <div className={styles.flavor_txt}>
                <p>👻PACMAN CAUGHT👻</p>
                <p>👻 GHOST WIN!👻</p>
              </div>
            ) : ghostScore > pacmanScore || game.lives < 0 ? (
              "👻 GHOST WIN! 👻"
            ) : pacmanScore === ghostScore ? (
              "TIE 👻🟡"
            ) : (
              "🟡 PACMAN WIN! 🟡"
            )}
          </p>
          <div className={styles.score_card}>
            <div className={styles.slider}>
              {game.lives < 0 ? (
                <TieSlider />
              ) : ghostScore > pacmanScore ? (
                <GhostsWinSlider />
              ) : pacmanScore === ghostScore ? (
                <TieSlider />
              ) : (
                <PacmanWinSlider />
              )}
            </div>
            <div className={styles.score}>
              <p>PACMAN: </p>
              <span>{pacmanScore} pts</span>
              <p>GHOSTS: </p>
              <p>{ghostScore} pts</p>
            </div>
            <div className={styles.btn_card}>
              <Button
                cKBtn={true}
                btnText={"EXIT"}
                className={`${styles.btn} cancel`}
                onClick={() => exitHandler()}
              />
              <Button
                cKBtn={true}
                btnText={"RESTART"}
                className={`${styles.btn} continue`}
                onClick={() => restartHandler()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
