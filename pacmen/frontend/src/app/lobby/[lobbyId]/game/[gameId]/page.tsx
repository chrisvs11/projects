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

const WAIT_FRAMES: number = 8;
const WAIT_TIME: number = 5000;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [pacmanScore, setPacmanScore] = useState<number>(0);
  const [ghostScore, setGhostScore] = useState<number>(0);
  const [gamePlayerStates, setGamePlayerStates] = useState<GamePlayerStates>();
  const [tileWidth, setTileWidth] = useState<number>(TILE_WIDTH);
  const [windowWidth, setWindowWidth] = useState<number>(0);
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
  } = usePlayer();
  const { scareGhosts, returnToNormalGhosts } = usePacman();
  const { moveYourAvatar, leaveLobby } = useCustomQuery();
  const { collisionHandler } = useCollisionHandler();
  const router = useRouter();

  const eventListenerKeyDown = (e: KeyboardEvent) => {
    console.log("key pressed:", e.key);
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
    gameAudios.ghostSirenMusicStop();

    router.push("/");
  };

  const restartHandler = () => {
    if (game) router.push(`/lobby/${game.lobbyId}`);
  };

  useEffect(() => {
    const newTileWidth =
      windowWidth >= 1000 ? TILE_WIDTH : windowWidth >= 600 ? 15 : 10;
    setTileWidth(newTileWidth);
  }, [windowWidth]);

  useEffect(() => {
    if (!gameMap || !gamePlayerStates || !game) return;

    if (game.gameState === GameState.END) return;

    if (!player) setPlayer(game.players[parseInt(playerId) - 1]);

    let animationFrameId: number;

    const renderFrame = () => {
      frameCountRef.current += 1;

      if (frameCountRef.current % WAIT_FRAMES !== 0)
        return (animationFrameId = requestAnimationFrame(renderFrame));

      if (game.gameState === GameState.ON_GOING && direction) {
        const currentCoordinates = gamePlayerStates[playerId].next;
        const nextCoordinates = getNextCoordinates(currentCoordinates, gameMap);
        // const canAvatarMoved = nextCoordinates !== currentCoordinates; // why does the websockets does not work when this is on
        // if (!canAvatarMoved) return;
        moveYourAvatar({
          playerNumber: playerId,
          gameId: gameId,
          move: {
            next: nextCoordinates,
            direction: direction,
          },
        });
      }
      if (game.gameState === GameState.RESTART) {
        gameAudios.ghostSirenMusicStop();
        moveYourAvatar({
          playerNumber: playerId,
          gameId: gameId,
          move: {
            next: gamePlayerStates[playerId].start,
            direction: Direction.RIGHT,
          },
        });
      }
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMap, gamePlayerStates, game, direction]);

  const errorFn = () => {
    router.push("404");
  };

  function resize() {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    if (!game || !gamePlayerStates || !mapTiles) return;

    latestGamePlayerStateRef.current = gamePlayerStates;

    if (game.gameState === GameState.END) {
      gameAudios.ghostSirenMusicStop();
      gameAudios.gameOverMusicStart();
      return;
    }

    const pacmanState = gamePlayerStates[String(game.pacmanId)];

    //Item Handler Phase
    const item = getMapTileItem(pacmanState.next, mapTiles);
    let points: number = pointsHash[item || GameItem.EMPTY];

    if (item === GameItem.POWER_UP && String(game.pacmanId) === playerId) {
      gameAudios.playPowerUpSounds(POWER_UP_TIME);
      scareGhosts(gamePlayerStates, game.id);
      setTimeout(() => {
        gameAudios.playExtendMusic();
        gameAudios.frightMovingMusicStop();
      }, POWER_UP_TIME - 2500);

      if (timerRef.current) clearTimeout(timerRef.current);

      const powerUpTime = setTimeout(() => {
        if (latestGamePlayerStateRef.current) {
          returnToNormalGhosts(latestGamePlayerStateRef.current, gameId);
        }
      }, POWER_UP_TIME);

      timerRef.current = powerUpTime;
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
  }, [gamePlayerStates, game, direction, mapTiles]);

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

    setLoading(false);


    gameAudios.introSongMusicStop();
    gameAudios.startGameMusic();
    const timerId = setTimeout(() => {
      gameAudios.ghostSirenMusicStart();
      window.addEventListener("keydown", eventListenerKeyDown);
    },WAIT_TIME);

    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", resize);

    return () => {
      gameSubscription();
      movesSubscription();
      window.removeEventListener("keydown", eventListenerKeyDown);
      window.removeEventListener("resize", resize);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <div className={styles.body}>
      <div></div>
      {!loading && game && game?.gameState !== GameState.END && (
        <div className={`card ${styles.card}`}>
          <div className={styles.game_metadata}>
            <div className={styles.game_stats_card}>
              <PacmanSprite state={PlayerState.ALIVE} velocity={1 - 1 / 3} />
              <p>x{game.lives < 0 ? 0 : game?.lives}</p>
            </div>
            <div className={styles.game_stats_card}>
              Pacman Score: {pacmanScore} pts
            </div>
            <div className={styles.game_stats_card}>
              Ghost Score: {ghostScore} pts
            </div>
            <div className={styles.game_stats_card}>
              Timer: {Math.max(game.playtime, 0)} s
            </div>
            <div className={styles.game_stats_card}>
              You are player{playerId}!
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
              game?.players.map((player: Player) => {
                const playerStat = gamePlayerStates[String(player.id)];
                const commonProps = {
                  offsetX: MAP_OFFSET.X,
                  offsetY: MAP_OFFSET.Y,
                  playerNum: player.id,
                  ghostType: player.type,
                  role: player.role,
                  scale: 0.7,
                  coordinatesToRecCoordinates: () =>
                    getRecCoordinatesOfElementById(playerStat.next, TILE_WIDTH),
                  mapTiles: mapTiles,
                  cols: gameMap.cols,
                };
                console.log(player.next);

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
      {!loading && game?.gameState !== GameState.END && windowWidth < 600 && (
        <div className={styles.controller} style={{ color: "white" }}>
          <Button
            cKBtn={true}
            btnText={"↑"}
            className={`${styles.up} ${styles.control}`}
            onClick={() => setDirection(Direction.UP)}
          />
          <Button
            cKBtn={true}
            btnText={"←"}
            className={`${styles.left} ${styles.control}`}
            onClick={() => setDirection(Direction.LEFT)}
          />
          <Button
            cKBtn={true}
            btnText={"→"}
            className={`${styles.right} ${styles.control}`}
            onClick={() => setDirection(Direction.RIGHT)}
          />
          <Button
            cKBtn={true}
            btnText={"↓"}
            className={`${styles.down} ${styles.control}`}
            onClick={() => setDirection(Direction.DOWN)}
          />
        </div>
      )}
    </div>
  );
}
