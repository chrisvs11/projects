"use client";

import { useEffect, useState } from "react";

import styles from "./lobby-session.module.css";

import FirebaseService from "@/shared/services/firebase-service";

import {
  Button,
  CollectionNames,
  Game,
  Lobby,
  MapLayout,
  MemberCard,
  useTimer,
} from "@/shared";

import GameMap from "@/shared/types/game-map.type";

import PacmanLoader from "react-spinners/PacmanLoader";

import { useUsername } from "@/shared/hooks/username.hook";

import { useRouter } from "next/navigation";

import {
  useGameCreateMutation,
  useLobbyJoinMutation,
  useLobbyLeaveMutation,
} from "@/shared/services/tanstack-query";

const firebaseService = new FirebaseService();

const WAITING_TIME: number = 120;

export default function Page({ params }: { params: { lobbyId: string } }) {
  const [currentLobby, setCurrentLobby] = useState<Lobby>();
  const { timer, startTimer, clearTimer } = useTimer(WAITING_TIME);
  const [gameMap, setGameMap] = useState<GameMap>();
  const [loading, setLoading] = useState<boolean>(true);
  const { username: currentUsername } = useUsername();
  const router = useRouter();

  const { mutate: leaveLobby } = useLobbyLeaveMutation({
    onSuccess: () => {
      console.log(`user ${currentUsername} leave the lobby`);
    },
    onError: () => {
      console.error("Error exiting the lobby");
    },
  });

  const {mutate:joinLobby} = useLobbyJoinMutation({
    onSuccess:() => {
      console.log("added npc")
    },
    onError:() => {
      console.error("Error adding npc")
    }

  })

  const { mutate: mutateGame } = useGameCreateMutation({
    onSuccess: (data: Game) => {
      console.log("Game created");
      router.push(`${params.lobbyId}/game/${data.id}`);
    },
    onError: () => {
      console.error("Error creating the game");
      router.push("404");
    },
  });

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

  const getNpcName = (): string | null => {
    if (!currentLobby) return null;

    const {members,maxPlayers} = currentLobby

    if (members.length >= maxPlayers) return null;

    const npcNames: string[] = ["blinky", "pinky", "inky", "clyde"];
    let nameFound: boolean = false;
    let index: number = 0;
    while (!nameFound) {
      const currentName: string = npcNames[index];
      const nameIndex = currentLobby!.members.findIndex(
        (member) => member.username === currentName
      );
      if (nameIndex < 0) {
        nameFound = true;
      } else {
        index++;
      }

      if (index >= npcNames.length) {
        nameFound = true;
        console.log("No NPC left to add");
        return null;
      }
    }

    return npcNames[index];
  };

  const addNPC = () => {
    const npcName = getNpcName()
    if(npcName) joinLobby({username:npcName,lobbyId:params.lobbyId})
  }



  const exitLobby = (username: string, lobbyId: string) => {
    leaveLobby({ username, lobbyId });
    router.push("/");
  };

  const startGame = () => {
    mutateGame({ lobbyId: params.lobbyId });
  };

  useEffect(() => {
    fetchMap();
  }, [currentLobby]);

  useEffect(() => {
    const { unsubscribe } = firebaseService.getRealTimeDocument(
      CollectionNames.LOBBIES,
      params.lobbyId,
      (data) => setCurrentLobby(data)
    );

    startTimer();
    fetchMap();

    return () => {
      unsubscribe();
      clearTimer();
    };
  }, []);

  return (
    <div className="body">
      <div className="card">
        {!loading && (
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
        {!loading && currentLobby && !currentLobby.deletedAt ? (
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
                      lobbyId={params.lobbyId}
                    />
                  ))}
                  {}
                </div>
                <Button
                  cKBtn
                  btnText="Add NPC"
                  className={styles.add_btn}
                  onClick={() => addNPC()}
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
