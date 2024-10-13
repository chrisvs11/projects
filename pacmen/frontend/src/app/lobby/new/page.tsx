"use client";
import { SetStateAction, useEffect, useState } from "react";

import styles from "./new.module.css";

import FirebaseService from "@/shared/services/firebase-service";

import {
  Button,
  CollectionNames,
  ListPropertyContainer,
  Lobby,
  LobbyCreationProps,
  LobbyType,
  MapSelectContainer,
  NumPropertyContainer,
  useLobbyCreateMutation,
} from "@/shared";

import GameMap from "@/shared/types/game-map.type";

import Link from "next/link";

import PacmanLoader from "react-spinners/PacmanLoader";

import { useRouter } from "next/navigation";

import { useUsername } from "@/shared/hooks/username.hook";

const firebaseService: FirebaseService = new FirebaseService();

const WAIT_TIME: number = 1500;

const list_lobby_types: LobbyType[] = [
  LobbyType.LOCAL,
  LobbyType.PRIVATE,
  LobbyType.PUBLIC,
];

export default function LobbyCreationPage() {
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [lobbyType, setLobbyType] = useState<LobbyType>(LobbyType.PRIVATE);
  const [gameMaps, setGameMaps] = useState<GameMap[]>();
  const [players, setPlayers] = useState<number>(4);
  const [time, setTime] = useState<number>(60);
  const [lives, setLives] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { username: currentUsername } = useUsername();

  const { mutate } = useLobbyCreateMutation({
    onSuccess: (data: Lobby) => {
      router.push(`${data.uuid}`);
      console.log("Data successfully sent to database");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const settingTime = (time: number) => {
    setTime(time);
  };

  const settingLives = (lives: number) => {
    setLives(lives);
  };

  const settingPlayers = (players: number) => {
    setPlayers(players);
  };

  const settingLobbyRoomType = (index: number) => {
    setLobbyType(list_lobby_types[index]);
  };

  const clickHandler = async () => {
    
    const newLobby: LobbyCreationProps = {
      maxPlayers: players,
      type: lobbyType,
      hostUsername: currentUsername,
      mapId: gameMaps![mapIndex].id!,
      playtime: time,
      lives: lives,
    };

    console.log(newLobby)

    mutate(newLobby);
  };

  const getAllGameMaps = async () => {
    try {
      const gameMaps: GameMap[] = (await firebaseService.getAllDocsInCollection(
        CollectionNames.MAPS
      )) as GameMap[];
      setGameMaps(gameMaps);
      setTimeout(() => {
        setLoading(false);
      }, WAIT_TIME);
    } catch (error) {
      console.error("Error getting the map", error);
    }
  };

  const updateNumPlayer = () => {
    if (gameMaps) {
      let currentPlayer = players;
      let currentMap = gameMaps[mapIndex];
      if (currentPlayer < currentMap.minPlayers) {
        setPlayers(currentMap.minPlayers);
      } else if (currentPlayer > currentMap.maxPlayers) {
        setPlayers(currentMap.maxPlayers);
      }
    }
  };

  useEffect(() => {
    getAllGameMaps();
    updateNumPlayer();
  }, [mapIndex]);
  

  return (
    <div className="body">
      <div className={"card"}>
        {!loading && gameMaps ? (
          <div>
            <div className={styles.title}>Create New Lobby</div>
            <div className={styles.lobby_edit}>
              <MapSelectContainer
                currentMap={gameMaps[mapIndex]}
                setMapIndex={setMapIndex}
                mapIndex={mapIndex}
                mapsLength={gameMaps.length}
              />
              <div className={styles.properties_container}>
                <ListPropertyContainer
                  propertyTitle={"Lobby Type"}
                  optionList={list_lobby_types}
                  optionValue={lobbyType}
                  setListValue={settingLobbyRoomType}
                />

                <NumPropertyContainer
                  propertyTitle={"Players"}
                  propertyValue={players}
                  propertyTop={gameMaps[mapIndex].maxPlayers}
                  propertyBottom={gameMaps[mapIndex].minPlayers}
                  step={1}
                  setProperty={settingPlayers}
                />

                <NumPropertyContainer
                  propertyTitle={"Lives"}
                  propertyValue={lives}
                  propertyTop={3}
                  propertyBottom={1}
                  step={1}
                  setProperty={settingLives}
                />

                <NumPropertyContainer
                  propertyTitle={"Playtime (s):"}
                  propertyValue={time}
                  propertyTop={90}
                  step={15}
                  setProperty={settingTime}
                  propertyBottom={45}
                  className={styles.playtime}
                />
              </div>

              <div className={styles.btns_container}>
                <Link href={"/lobby"}>
                  <Button
                    cKBtn={true}
                    btnText={"Cancel"}
                    className={styles.btn}
                  />
                </Link>
                <Button
                  cKBtn={true}
                  btnText={"Confirm"}
                  className={styles.btn}
                  onClick={() => clickHandler()}
                />
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
