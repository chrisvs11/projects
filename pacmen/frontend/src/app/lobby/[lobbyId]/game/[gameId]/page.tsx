"use client";
import { useEffect, useState } from "react";

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

import {  useGameMap, useScoreTracker } from "@/shared/hooks";

import {
  Button,
  GameBoard,
  GameOverCard,
  GameStats,
} from "@/shared/components";

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

  const exitHandler = () => {
    // if(username === hostname) {
    //   console.log("ending the game")
    //   updateGameState({
    //     state: String(GameState.END),
    //     gameId: gameId
    //   })
    // }

    router.push("/");
    SessionStorage.eliminateValue("lobbyId");
    SessionStorage.eliminateValue("gameId");
  };

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
      {game?.gameState !== GameState.END && (
        <div className={styles.exit_btn_container}>
          <Button
            cKBtn={false}
            btnText={"LEAVE"}
            className={styles.exit_btn}
            onClick={() => exitHandler()}
          />
        </div>
      )}
      <div className={`card ${styles.card}`}>
        {game && playerId && localPlayer && gamePlayersState && (
          <>
            <div className={`${styles.stats} `}>
              <GameStats
                lives={game.lives}
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
                gameId={game.id}
                players={game.players}
                pacmanId={String(game.pacmanId!)}
                gameState={game.gameState!}
              />
            </div>
          </>
        )}
        {game?.gameState === GameState.END && (
          <div className={styles.game_over_card_container}>
            <GameOverCard
              lives={game?.lives || 99}
              pacmanScore={scores.pacmanScore}
              ghostScore={scores.ghostScore}
            />
          </div>
        )}
      </div>
    </div>
  );
}
