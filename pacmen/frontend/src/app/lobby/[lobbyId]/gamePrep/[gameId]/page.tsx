"use client";

import { Button, RouletteAvatar } from "@/shared/components";

import { firebaseService } from "@/shared/services";

import { CollectionName, Game, GameRole, GameState, Lobby, Player } from "@/shared/types";

import { CSSProperties, useEffect, useState } from "react";

import styles from "./game-prep.module.css";

import { useCustomQuery, useUsername } from "@/shared/hooks";
import { Unsubscribe } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Page({
  params: { lobbyId, gameId },
}: {
  params: { lobbyId: string; gameId: string };
}) {
  const [game, setGame] = useState<Game>();
  const [participants, setParticipants] = useState<Player[]>();
  const [pacmanUsername, setPacmanUsername] = useState<string>();
  const [rouletteTimer, setRouletteTimer] = useState<NodeJS.Timeout | null>(null);
  const {username,setUsername} = useUsername()
  const [lobby,setLobby] = useState<Lobby|null>(null)
  const [rouletteEnded, setRouletteEnded] = useState<boolean>(false)
  const {startGame,updateGameState} = useCustomQuery()
  const router = useRouter()

  const fetchLobby = async (lobbyId: string) => {
    try {
      const lobby = (await firebaseService.getData<Lobby>(
        CollectionName.LOBBIES,
        lobbyId 
      )) as Lobby
      setLobby(lobby);
    } catch (e) {
      console.error("Failed to fetch the game:", e);
    }
  };

  const randomizePacman = () => {
    setParticipants((prev) => {
      if (!prev || prev.length === 0) return;

      const length: number = prev.length;
      const pacmanIndex: number = prev.findIndex(
        (participant) => participant.role === GameRole.PACMAN
      );
      let nextIndex: number;

      do {
        nextIndex = Math.floor(Math.random() * length);
      } while (nextIndex === pacmanIndex);

      const newParticipants: Player[] = prev.map((participant, index) => {
        if (index === pacmanIndex) {
          return { ...participant, role: GameRole.GHOST };
        }
        if (index === nextIndex) {
          return { ...participant, role: GameRole.PACMAN };
        }
        return participant;
      });

      return newParticipants;
    });
  };

  const startRoulette = (intervalTime: number, stop: number) => {
    const startTime = Date.now();
    if (rouletteTimer) return;

    const intervalId = setInterval(() => {
      const elapseTime = Date.now() - startTime;
      randomizePacman();
      if (elapseTime >= stop) {
        clearInterval(intervalId);
        setRouletteTimer(null);
        selectFinalPacman();
        setRouletteEnded(true)
      }
    }, intervalTime);
  
    if (!rouletteTimer) setRouletteTimer(intervalId);
  };

  const selectFinalPacman = () => {
    setParticipants((prev) => {
      if (!prev) return;
      return prev.map((participant) => {
        if (participant.username === pacmanUsername) {
          return { ...participant, role: GameRole.PACMAN };
        } else {
          return { ...participant, role: GameRole.GHOST };
        }
      });
    });
  };

  const startGameHandler = async() => {
    try {
      await startGame({
      lobbyId: lobbyId,
      gameId: gameId
    })
      await updateGameState({
        state: GameState.ON_GOING,
        gameId: gameId
      })

    router.push(`/lobby/${lobbyId}/game/${gameId}`)
  } catch(e) {
    console.error(e)
  }
 
  }

  useEffect(() => {
    //Start Pacman Roulette
    const clockId = setTimeout(() => {
      startRoulette(200, 2000);
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
    if (!pacmanPlayer) return;
    setPacmanUsername(pacmanPlayer.username);
  }, [game]);

  useEffect(() => {
    const unsubscribe:Unsubscribe = firebaseService.getRealTimeDocument<Game>(
      CollectionName.GAMES,
      gameId,
      setGame,
      () => console.log("Error")
    )

    if(!username ) {
      const playerName = localStorage.getItem("username")
      if(!playerName) {
        router.push("/")
      } else {
        setUsername(playerName)
      }
    }

    fetchLobby(lobbyId)
    return () => {
      if (rouletteTimer) clearTimeout(rouletteTimer);
      unsubscribe()
    };
  }, []);

  const gridProps: CSSProperties = {
    gridTemplateColumns: `repeat(${participants?.length},1fr)`,
  };

  return (
    <div className={styles.body}>
      <div className={`card`}>
        <div className={styles.title}>PACMAN ROULETTE</div>
        <div className={styles.participants} style={gridProps}>
          {participants?.map((player) => {
            return (
              <div key={player.id}>
                <RouletteAvatar
                  username={player.username}
                  role={player.role}
                  type={player.type}
                  rouletteEnded = {rouletteEnded}
                  ready={player.ready}
                  gameId={gameId}
                />
              </div>
            );
          })}
        </div>
        {username === lobby?.hostUsername && rouletteEnded &&  <Button
          cKBtn={true}
          btnText={game?.players.some(player => !player.ready)?"PENDING PLAYERS":"START GAME"}
          className={"btn"}
          onClick={() => startGameHandler()}
        />}
      </div>
    </div>
  );
}
