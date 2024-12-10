"use client";
import { useEffect,  useState } from "react";

import styles from "./game.module.css";

import { useRouter } from "next/navigation";

import {
  CollectionName,
  Game,
  GamePlayersStates,
  GameRole,
  GameState,
  Player,
} from "@/shared/types";

import { useGameMap, useScoreTracker } from "@/shared/hooks";

import { GameBoard, GameOverCard, GameStats } from "@/shared/components";

import { firebaseService } from "@/shared/services";

import { myAudioProvider, SessionStorage } from "@/shared/aux-classes";

const WAIT_TIME: number = 5000;

export default function Page({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const [game, setGame] = useState<Game>();
  const [gamePlayersState, setGamePlayerState] = useState<GamePlayersStates>();
  const { scores } = useScoreTracker();
  const { fetchMap, gameMap, numPellets } = useGameMap();
  const [playerId, setPlayerId] = useState<string>();
  const [localPlayer, setLocalPlayer] = useState<Player>();
  const router = useRouter();
  const errorFn = () => {
    router.push("404");
  };
  const isGameReady: boolean =
    game &&
    playerId &&
    localPlayer &&
    gamePlayersState &&
    gameMap &&
    game.gameState !== GameState.END
      ? true
      : false;


  const endOfGameSounds = () => {
    myAudioProvider.stopAllMusic();
    myAudioProvider.playGameOverMusic();
  };

  const startGameSounds = (): NodeJS.Timeout => {
    myAudioProvider.playIntroSongMusic(false);
    myAudioProvider.playStartGameMusic(true);

    const timerId = setTimeout(() => {
      myAudioProvider.playGhostSirenSound(true);
    }, WAIT_TIME);

    return timerId;
  };

  const gameSoundsHandler = (gameState: GameState): NodeJS.Timeout | null => {
    switch (gameState) {
      case GameState.END:
        endOfGameSounds();
        return null;
      case GameState.START:
        const timer = startGameSounds();
        return timer;
      default:
        console.log(`Game state is: ${gameState}`);
        return null;
    }
  };

  useEffect(() => {
    if (!game?.mapId) return;
    fetchMap(game.mapId);
  }, [game?.mapId]);

  useEffect(() => {
    if (!game) return;

    const startGameTimer = gameSoundsHandler(game.gameState);

    return () => {
      if (startGameTimer) clearTimeout(startGameTimer);
    };
  }, [game]);

  useEffect(() => {
    if (localPlayer || !game || !playerId) return;
    setLocalPlayer(game.players[parseInt(playerId) - 1]);
  }, [game, localPlayer, playerId]);

  useEffect(() => {
    //Start subscription for real database
    const gameSubs = firebaseService.getRealTimeDocument(
      CollectionName.GAMES,
      gameId,
      (data: Game) => setGame(data),
      () => errorFn()
    );

    const gamePlayerStatesSubs = firebaseService.getRealTimeDocument(
      CollectionName.STATS,
      gameId,
      (data: GamePlayersStates) => setGamePlayerState(data),
      () => console.error("Error getting the players recent moves")
    );

    //Load data from session storage
    const lobbyId = SessionStorage.getValue("lobbyId");
    const playerId = SessionStorage.getValue("playerId");
    if (!lobbyId || !playerId) router.push("/");
    setPlayerId(playerId);

    return () => {
      console.log("eliminating websockets...");
      gameSubs();
      gamePlayerStatesSubs();
    };
  }, []);

  return (
    <div className={styles.body}>
      <div className={`card ${styles.card}`}>
        {isGameReady && game && (
          <>
            <div className={`${styles.stats} `}>
              <GameStats
                lives={game.lives || 99}
                playtime={game.playtime}
                playerId={playerId || ""}
                role={localPlayer?.role || GameRole.GHOST}
                numPellets={numPellets}
              />
            </div>

            <div className={`${styles.game}`}>
              <GameBoard
                waitTime={WAIT_TIME}
                playerId={playerId!}
                lives={game.lives!}
                gameMap={gameMap}
                gamePlayerStates={gamePlayersState!}
                time={game.playtime!}
                gameId={game.id }
                players={game.players}
                pacmanId={String(game.pacmanId!)}
                gameState={game.gameState!}
              />
            </div>
          </>
        )}
        {game?.gameState === GameState.END && (
          <GameOverCard
            lives={game?.lives || 99}
            pacmanScore={scores.pacmanScore}
            ghostScore={scores.ghostScore}
          />
        )}
      </div>
    </div>
  );
}
