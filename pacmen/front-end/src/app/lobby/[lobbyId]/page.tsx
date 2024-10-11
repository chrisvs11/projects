"use client";

import { useEffect, useState } from "react";

import styles from "./lobby-session.module.css";

import FirebaseService from "@/shared/services/firebase-service";

import {
  Button,
  CollectionNames,
  Direction,
  Game,
  Lobby,
  MapLayout,
  MemberCard,
  useLobbyId,
  useLobbyJoinMutation,
  useLobbyLeaveMutation,
  useTimer,
} from "@/shared";

import GameMap from "@/shared/types/game-map.type";

import PacmanLoader from "react-spinners/PacmanLoader";

import { useUsername } from "@/shared/hooks/username.hook";

import { useRouter } from "next/navigation";

import { useGameCreateMutation } from "@/shared/hooks/mutate-game.hook";

import { Unsubscribe } from "firebase/firestore";


const firebaseService = new FirebaseService();

const WAITING_TIME: number = 120;

export default function Page({ params }: { params: { lobbyId: string } }) {
  const [currentLobby, setCurrentLobby] = useState<Lobby>();
  const {timer,startTimer, clearTimer} = useTimer(WAITING_TIME)
  const [gameMap, setGameMap] = useState<GameMap>();
  const [loading, setLoading] = useState<boolean>(true);
  const { username: currentUsername } = useUsername();
  const { setLobbyId, lobbyId } = useLobbyId();
  const router = useRouter();
  const { mutate: leaveLobby } = useLobbyLeaveMutation({
    onSuccess: () => {
      console.log(`user ${currentUsername} leave the lobby`);
    },
    onError: () => {
      console.error("Error exiting the lobby");
    },
  });
  const { mutate: mutateGame } = useGameCreateMutation({
    onSuccess: (data: Game) => {
      console.log("Game created");
      router.push(`${params.lobbyId}/game/${data.uuid}`);
    },
    onError: () => {
      console.error("Error creating the game");
      setLoading(true)
    },
  });

  const {mutate: joinLobby} = useLobbyJoinMutation({
    onSuccess: () => {
      console.log("Member added successfully")
    },
    onError: () => {
      console.log("Error adding member")
    }
  })

  async function fetchMap() {
    try {
      const gameMap = (await firebaseService.getData(
        CollectionNames.MAPS,
        currentLobby?.mapId!
      )) as GameMap;
      setGameMap(gameMap);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  const selectNpc = (lobby:Lobby):string|null => {
    
    const npcNames: string[] = ["blinky", "pinky", "inky", "clyde"];
    let searchAll: boolean = false;
    let index: number = 0;

    while (!searchAll) {
      const currentNPC: string = npcNames[index];
      const nameIndex = lobby.members.findIndex(
        (member) => member.username === currentNPC
      );
      if (nameIndex < 0) {
        searchAll = true;
      } else {
        index++;
      }

      if (index >= npcNames.length) {
        searchAll = true;
        console.log("No NPC left to add");
        return null;
      }
    }
    return npcNames[index]
  }

  const AddNPC = async () => {

    try {
      
      if(!currentLobby) return
      
      if(currentLobby.members.length >= currentLobby.maxPlayers) return 

      const npcName:string|null = selectNpc(currentLobby)

      if(npcName)  joinLobby({lobbyId:currentLobby.id,username:npcName})

    } catch (e) {
      console.error
    }
  };

  const exitLobby = (username: string, lobbyId: string) => {
    leaveLobby({ username, lobbyId });
    router.push("/");
  };

  const startGame = () => {
    mutateGame({ lobbyId });
  };

  useEffect(() => {
    fetchMap();
    setLobbyId(currentLobby?.id!);
  }, [currentLobby]);

  const getWebSocket = (): Unsubscribe|null => {
    try{
      const { unsubscribe } = firebaseService.getRealTimeDocument(
        CollectionNames.LOBBIES,
        params.lobbyId,
        (data) => setCurrentLobby(data)
      );

      return unsubscribe
    } catch(e) {
      console.error("Error: ", e)
      return null
    }
  }

  useEffect(() => {
    
    const unsubscribe:Unsubscribe|null = getWebSocket()
    startTimer();
    fetchMap();

    return () => {
      if(unsubscribe) unsubscribe();
      clearTimer();
    };
  }, []);

  return (
    <div className="body">
      <div className="card">
        {!loading && currentLobby && (
          <div className={styles.title_container}>
            <div className={styles.title}>
              {!currentLobby?.deletedAt
                ? "Lobby Waiting Room"
                : "Game concluded"}
            </div>
            {!currentLobby?.deletedAt && (
              <div className={styles.player}>
                <p>Player Name:</p> <div>{currentUsername}</div>
              </div>
            )}
          </div>
        )}
        {!loading && !currentLobby?.deletedAt ? (
          <div className={styles.lobby_card}>
            <div className={styles.lobby_container}>
              <div className={styles.metaData}>
                <p>
                  Members: {currentLobby?.members.length}/
                  {currentLobby?.maxPlayers}
                </p>
                <p>Time to Start: {timer}</p>
              </div>
              <div className={styles.members_container}>
                <div className={styles.member_cards} style={{ width: "100%" }}>
                  {currentLobby?.members.map((member, index) => (
                    <MemberCard
                      key={index}
                      username={member.username}
                      position={index + 1}
                      isHost={member.username === currentLobby.hostUsername}
                      hostUsername={currentLobby.hostUsername}
                    />
                  ))}
                  {}
                </div>
                <Button
                  cKBtn
                  btnText="Add NPC"
                  className={styles.add_btn}
                  onClick={() => AddNPC()}
                />
              </div>
              <div
                className={styles.code_container}
              >{`LOBBY CODE: ${currentLobby?.code}`}</div>
            </div>
            <div className={styles.lobby_container}>
              {gameMap && (
                <div>
                  <div>{gameMap.name}</div>
                  <div className={styles.map_container}>
                    <MapLayout gameMap={gameMap} tilesHeight={10} />
                  </div>
                </div>
              )}
              <div className={styles.btn_container}>
                <Button
                  btnText="Exit Lobby"
                  className={styles.btn}
                  cKBtn
                  onClick={() =>
                    exitLobby(currentUsername, currentLobby?.uuid!)
                  }
                />
                {timer &&
                currentLobby &&
                currentLobby?.members.length < currentLobby?.maxPlayers ? (
                  <Button btnText="Edit Lobby" className={styles.btn} cKBtn />
                ) : (
                  <Button
                    btnText="Start Game"
                    className={styles.btn}
                    cKBtn
                    onClick={() => startGame()}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.loading}>
            <PacmanLoader
              color="yellow"
              loading={loading}
              margin={2}
              size={50}
              speedMultiplier={1}
            />
          </div>
        )}
      </div>
    </div>
  );
}
