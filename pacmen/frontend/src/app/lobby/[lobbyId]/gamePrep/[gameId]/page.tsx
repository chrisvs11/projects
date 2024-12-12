"use client";
import { CSSProperties, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Unsubscribe } from "firebase/firestore";

import { Button, RouletteAvatar } from "@/shared/components";

import { firebaseService } from "@/shared/services";

import {
  CollectionName,
  Game,
  GameRole,
  GameState,
  Session,
  UserSession,
} from "@/shared/types";

import { useCustomQuery, useRoulette } from "@/shared/hooks";

import { myAudioProvider } from "@/shared/aux-classes";

import styles from "./game-prep.module.css";

const READY_TIME:number = 30;

const session:Session = UserSession.getInstance()

export default function Page({
  params: { lobbyId, gameId },
}: {
  params: { lobbyId: string; gameId: string };
}) {
  const [game, setGame] = useState<Game>();
  const [time, setTime] = useState<number>(READY_TIME)
  const [allPlayersReady, setAllPlayersReady] = useState<boolean>(false);
  const [pacmanUsername, setPacmanUsername] = useState<string>();
  const { participants, startRoulette, setParticipants, rouletteEnded } =
    useRoulette(pacmanUsername || "");
  const { startGame,updateGameState } = useCustomQuery();
  const router = useRouter();


  const startGameHandler = async () => {
    try {
      //TODO:simplify in a single request
      await startGame({
        lobbyId: lobbyId,
        gameId: gameId,
      });

      await updateGameState({
        state: GameState.START,
        gameId: gameId
      })

    } catch (e) {
      console.error(e);
    }
  };

  const routerToGameBoard = (game: Game) => {
    if (game.gameState === GameState.START) {
      session.joinGame(game.id)
      session.saveInSessionStorage()
      router.push(`/lobby/${lobbyId}/game/${gameId}`);
    }
  };

  // useEffect(() => {
  //   if(time < 0) {
  //     startGameHandler()
  //   }
  // },[time])

  useEffect(() => {
    //Start Pacman Roulette
    const clockId = setTimeout(() => {
      myAudioProvider.playRouletteMusic()
      startRoulette(5, 5000);
    }, 2000);

    return () => {
      clearTimeout(clockId);
    };
  }, [pacmanUsername]);

  useEffect(() => {
    if (!game) return;

    setParticipants(game.players);
    
    const pacmanPlayer = game.players.find(
      (player) => player.role === GameRole.PACMAN
    );

    if (!pacmanPlayer) throw new Error ("pacman player not found");

    setPacmanUsername(pacmanPlayer.username);

    setAllPlayersReady(game.players.every((player) => player.ready));

    routerToGameBoard(game);
  }, [game]);

  useEffect(() => {
    const gameSubs: Unsubscribe = firebaseService.getRealTimeDocument<Game>(
      CollectionName.GAMES,
      gameId,
      setGame,
      () => console.log("Error")
    );

    const startTimer:NodeJS.Timeout = setInterval(() => {
      setTime(prev => prev -1)
    },1000)

    myAudioProvider.stopAllMusic();


    return () => {
      clearTimeout(startTimer)
      gameSubs();
    };
  }, []);

  const gridProps: CSSProperties = {
    gridTemplateColumns: `repeat(${participants?.length},1fr)`,
  };

  return (
    <div className={styles.body}>
      <div className={styles.clock}>Game will start in: {Math.max(time,0)} s</div>
      <div className={`card ${styles.card}`}>
        <div className={styles.title}>PACMAN ROULETTE</div>
        <div className={styles.participants} style={gridProps}>
          {participants?.map((player) => {
            return (
              <div key={player.id} className={styles.gridItem}>
                <RouletteAvatar
                  username={player.username}
                  role={player.role}
                  type={player.type}
                  rouletteEnded={rouletteEnded}
                  ready={player.ready && rouletteEnded}
                  gameId={gameId}
                  localUsername={session.getSession().username}
                />
              </div>
            );
          })}
        </div>
        {participants && (
          <p className={styles.selected_text}><span className={rouletteEnded ? styles.pacman_text:""}>{
            participants?.find(
              (participant) => participant.role === GameRole.PACMAN
            )?.username
          }</span> is the next Pacman!</p>
        )}
        {session.getSession().username === session.getSession().lobbyHost && (
          <div className={styles.ready_btn_container}>
            <Button
              cKBtn={true}
              btnText={allPlayersReady ? "START!" : "PLAYERS READY?"}
              className={`${
                allPlayersReady ? styles.ready_btn : styles.inactive
              }`}
              onClick={() => startGameHandler()}
            />
          </div>
        )}
        {rouletteEnded && !allPlayersReady && (
          <p className={styles.wait_text}>
            Game will start when everyone is ready...or times runs out
          </p>
        )}
      </div>
    </div>
  );
}
