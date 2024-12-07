"use client";
import { useCallback, useEffect, useState } from "react";

import styles from "./new.module.css";

import Link from "next/link";

import PacmanLoader from "react-spinners/PacmanLoader";

import { useCustomQuery, useLobbyCreation, useUsername } from "@/shared/hooks";

import { CollectionName, GameMap, LobbyCreationOptions } from "@/shared/types";

import {
  Button,
  ListPropertyContainer,
  MapSelectContainer,
  NumPropertyContainer,
} from "@/shared/components";
import { firebaseService } from "@/shared/services";

const TILES_WIDTH: number = 10;

const WAIT_TIME: number = 1500;

export default function LobbyCreationPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isClick, setIsClick] = useState<boolean>(false);
  const { username: currentUsername } = useUsername();
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
  } = useLobbyCreation();
  const { createLobby } = useCustomQuery();

  const [tileWidth, setTileWidth] = useState<number>(TILES_WIDTH);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const newTileWidth =
      windowWidth >= 1000 ? TILES_WIDTH : windowWidth >= 600 ? 8 : 6;
    setTileWidth(newTileWidth);
  }, [windowWidth]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    function resize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const clickHandler = async () => {
    setIsClick(true);
    const newLobby: LobbyCreationOptions = {
      maxPlayers: players,
      type: lobbyType,
      hostUsername: currentUsername,
      mapId: gameMaps![mapIndex].id!,
      playtime: time,
      lives: lives,
    };
    createLobby(newLobby);
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
  }, [setGameMaps, setLoading]);

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

  return (
    <div className="body">
      <div className={`card ${styles.card}`}>
        {!loading && gameMaps ? (
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
                  btnText={`${!isClick ? "CREATE LOBBY" : "PROCESSING..."}`}
                  className={`${styles.btn}  continue`}
                  onClick={() => clickHandler()}
                  disabled={isClick}
                  cssStyle={{ pointerEvents: `${!isClick ? "auto" : "none"}` }}
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
