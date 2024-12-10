"use client";
import { useCallback, useEffect, useState } from "react";

import styles from "./new.module.css";

import Link from "next/link";

import PacmanLoader from "react-spinners/PacmanLoader";

import { useCreateLobby, useCustomQuery } from "@/shared/hooks";

import {
  CollectionName,
  GameMap,
  Lobby,
  LobbyCreationOptions,
} from "@/shared/types";

import {
  Button,
  ListPropertyContainer,
  MapSelectContainer,
  NumPropertyContainer,
} from "@/shared/components";

import { firebaseService } from "@/shared/services";

import { useRouter } from "next/navigation";

import { myAudioProvider, SessionStorage } from "@/shared/aux-classes";

const TILES_WIDTH: number = 10;

const WAIT_TIME: number = 1500;

export default function LobbyCreationPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isClick, setIsClick] = useState<boolean>(false);
  const router = useRouter();
  const {
    lobbyType,
    players,
    time,
    lives,
    mapIndex,
    gameMaps,
    settingLobbyRoomType,
    settingPlayers,
    settingTime,
    setMapIndex,
    setGameMaps,
    settingLives,
    list_lobby_types,
  } = useCreateLobby();
  const { createLobby } = useCustomQuery();
  const [tileWidth, setTileWidth] = useState<number>(TILES_WIDTH);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const resize = () => {
    console.log("resizing...")
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    const newTileWidth =
      windowWidth >= 1000 ? TILES_WIDTH : windowWidth >= 600 ? 8 : 6;
    setTileWidth(newTileWidth);
  }, [windowWidth]);

  const createLobbyHandler = async () => {
    setIsClick((prev) => !prev);
    try {
      const newLobbyProps: LobbyCreationOptions = {
        maxPlayers: players,
        type: lobbyType,
        hostUsername: SessionStorage.getValue("username"),
        mapId: gameMaps![mapIndex].id,
        playtime: time,
        lives: lives,
      };
      const lobby: Lobby = await createLobby(newLobbyProps);
      SessionStorage.setValue("lobbyId", lobby.id);
      router.push(`${lobby.id}`);
    } catch (e) {
      console.error(e);
      setIsClick(false);
    }
  };

  const getAllMaps = useCallback(async () => {
    const gameMaps: GameMap[] =
      await firebaseService.getAllDocsInCollection<GameMap>(
        CollectionName.MAPS
      );
    setGameMaps(gameMaps);
    setTimeout(() => {
      setLoading(false);
    }, WAIT_TIME);
  }, [gameMaps]);

  const updateNumPlayer = useCallback(() => {
    if (!gameMaps) return;
    const { maxPlayers } = gameMaps[mapIndex];
    const newPlayerNum = players > maxPlayers ? maxPlayers : players;
    settingPlayers(newPlayerNum);
  }, [gameMaps, mapIndex, players, settingPlayers]);

  useEffect(() => {
    getAllMaps();
    updateNumPlayer();
  }, [mapIndex]);

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    console.log("window width", windowWidth)
  },[windowWidth])


  useEffect(() => {
  
    window.addEventListener("resize", resize);
    myAudioProvider.playIntroSongMusic(true);

    return () => window.removeEventListener("resize", resize);
  }, []);
  
  return (
    <div className="body">
      <div className={`card ${styles.card}`}>
        {!loading && gameMaps && gameMaps?.length > 0 && (
          <div>
            <div className={styles.lobby_edit}>
              <MapSelectContainer
                currentMap={gameMaps[mapIndex]}
                setMapIndex={setMapIndex}
                mapIndex={mapIndex}
                mapsLength={gameMaps.length}
                className={styles.map}
                tileWidth={tileWidth}
              />
              <div className={styles.properties_container}>
                <NumPropertyContainer
                  propertyTitle={"Max Players"}
                  propertyValue={players}
                  propertyTop={gameMaps[mapIndex].maxPlayers}
                  propertyBottom={1}
                  step={1}
                  setProperty={settingPlayers}
                />

                <NumPropertyContainer
                  propertyTitle={"Lives"}
                  propertyValue={lives}
                  propertyTop={3}
                  propertyBottom={0}
                  step={1}
                  setProperty={settingLives}
                />
                <div className={styles.odd_row}>
                  <NumPropertyContainer
                    propertyTitle={"Sec:"}
                    propertyValue={time}
                    propertyTop={90}
                    step={5}
                    setProperty={settingTime}
                    propertyBottom={5}
                  />
                </div>
              </div>
              <div id={"lobby_type"} className="private">
                <ListPropertyContainer
                  propertyTitle={"Lobby"}
                  optionList={list_lobby_types}
                  optionValue={lobbyType}
                  setListValue={settingLobbyRoomType}
                  className={`${styles.lobby_btn}`}
                />
              </div>
              <div className={styles.btns_container}>
                <Button
                  cKBtn={true}
                  btnText={`${!isClick ? "CREATE LOBBY" : "CREATING..."}`}
                  className={`${styles.btn}  continue`}
                  onClick={() => createLobbyHandler()}
                />
              </div>
            </div>
          </div>
        )}
        {loading &&  (
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
      {!loading && (
        <div className={styles.btn_cancel}>
          <Link href={"/lobby"}>
            <Button
              cKBtn={true}
              btnText={"BACK"}
              className={`${styles.btn} cancel`}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
