"use client";

import { useCallback, useEffect, useState } from "react";

import styles from "./lobby-session.module.css";

import PacmanLoader from "react-spinners/PacmanLoader";

import { useRouter } from "next/navigation";

import {
  useCustomQuery,
  useLobbyId,
  useMapLayout,
  useNPC,
  usePlayer,
  useUsername,
} from "@/shared/hooks";

import { CollectionName, GameMap, Lobby } from "@/shared/types";

import { MemberCard, MapLayout, Button } from "@/shared/components";

import { GameAudios } from "@/shared/aux-classes";

import { BASE_URL, firebaseService } from "@/shared/services";


const TILE_WIDTH: number = 10;

const LOADING_LOBBY_TIME: number = 2000;

export default function Page({ params }: { params: { lobbyId: string } }) {
  const gameAudios = new GameAudios();
  //Page states
  const [isClick, setIsClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);
  const [tileWidth, setTileWidth] = useState<number>(TILE_WIDTH);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  //Custom hooks
  const { gameMap, updateGameMap, mapTiles, setMapTiles } = useMapLayout();
  const { getNPCName } = useNPC();
  const { setLobbyId } = useLobbyId();
  const { addNPCToLobby, leaveLobby, createGame } = useCustomQuery();
  const { username: currentUsername } = useUsername();
  const { setId } = usePlayer();
  const router = useRouter();

  //Start Page Logic
  async function getGameMap(mapId: string): Promise<GameMap> {
    const gameMap = await firebaseService.getData<GameMap>(
      CollectionName.MAPS,
      mapId
    );
    if (!gameMap) throw new Error("ERROR GETTING THE MAP...");
    return gameMap;
  }

  const errorFn = () => {
    router.push("/404");
  };

  const addNPC = () => {
    if (!currentLobby) return;
    const npcName = getNPCName(currentLobby);
    if (npcName) addNPCToLobby({ username: npcName, lobbyId: params.lobbyId });
  };

  const exitLobby = (username: string, lobbyId: string) => {
    leaveLobby({ username, lobbyId });
    setLobbyId(null);
    router.push("/");
  };

  const prepareGame = () => {
    if(!currentLobby) return 
    setIsClicked(true);
    createGame({
      lobbyId: currentLobby.id
    })
  };

const unloadHandler = useCallback(() => {
  const navigationEntries = performance.getEntriesByType("navigation");
  
  if(navigationEntries.length === 0) return 

  const navigationTiming = navigationEntries[0] as PerformanceNavigationTiming

  if(navigationTiming.type === "reload") return 
  if (currentUsername && currentLobby?.id) {
    navigator.sendBeacon(`${BASE_URL}/lobbies/leave/${currentLobby.id}/${currentUsername}`)
  }
}, [currentUsername, currentLobby]);

  //Use Effects
  useEffect(() => {
    const newTileWidth =
      windowWidth >= 700 ? TILE_WIDTH : windowWidth >= 200 ? 8.5 : 6;
    setTileWidth(newTileWidth);
  }, [windowWidth]);

  useEffect(() => {
    if (!currentLobby) return;

    getGameMap(currentLobby.mapId).then((value) => {
      updateGameMap(value);
    });

    setId(currentLobby.members);

    window.addEventListener("beforeunload", unloadHandler);

    setTimeout(() => {
      setLoading(false);
    }, LOADING_LOBBY_TIME);

    return () => {
      window.removeEventListener("beforeunload", unloadHandler);
    };
  }, [currentLobby, unloadHandler]);

  useEffect(() => {
    if (!gameMap) return;
    setMapTiles(gameMap.tiles);
  }, [gameMap]);

  useEffect(() => {
    const lobbySubscription = firebaseService.getRealTimeDocument(
      CollectionName.LOBBIES,
      params.lobbyId,
      (data: Lobby) => setCurrentLobby(data),
      () => errorFn()
    );

    gameAudios.stopAllMusic();


    setWindowWidth(window.innerWidth);
    function resize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);

    return () => {
      lobbySubscription();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="body">
      <div className={`card ${styles.card}`}>
        {!loading && (
          <div className={styles.title_container}>
            <div className={styles.title}>
              {!currentLobby?.deletedAt ? "WAITING ROOM" : "Game concluded"}
            </div>
            <div className={styles.code_container}>
              {`# ${currentLobby?.code}`}
            </div>
          </div>
        )}
        {!loading && currentLobby && !currentLobby.deletedAt ? (
          <div className={styles.lobby_card}>
            <div className={styles.lobby_container}>
              <div className={styles.members_container}>
                <div
                  className={styles.member_cards_container}
                  style={{ width: "100%" }}
                >
                  {currentLobby?.members.map((member, index) => (
                    <MemberCard
                      key={index}
                      username={member.username}
                      position={index + 1}
                      isHost={member.username === currentLobby.hostUsername}
                      hostUsername={currentLobby.hostUsername}
                      lobbyId={params.lobbyId}
                      ghostType={member.type}
                    />
                  ))}
                  {}
                </div>
                {currentUsername === currentLobby.hostUsername && (
                  <Button
                    cKBtn
                    btnText="👻+"
                    className={`${styles.add_btn} ${
                      currentLobby.members.length >= currentLobby.maxPlayers
                        ? styles.disabled
                        : ""
                    }`}
                    onClick={() => addNPC()}
                    disabled={
                      currentLobby.members.length >= currentLobby.maxPlayers
                    }
                  />
                )}
              </div>
              <div className={styles.btn_container}>
                {currentUsername === currentLobby.hostUsername && (
                  
                  <Button
                    btnText={!isClick ? `START PACMAN ROULETTE` : `Processing...`}
                    className={`${styles.btn} continue ${
                      currentLobby.members.length < currentLobby.maxPlayers &&
                      styles.no_active_btn
                    }`}
                    cKBtn
                    onClick={() => prepareGame()}
                    disabled={isClick}
                    cssStyle={{ pointerEvents: `${isClick ? "none" : "auto"}` }}
                  />
                )}
              </div>
            </div>

            <div className={styles.lobby_container}>
              {gameMap && (
                <div>
                  <div className={styles.map_container}>
                    <div>
                      {mapTiles && gameMap && (
                        <MapLayout
                          mapTiles={mapTiles}
                          tilesHeight={tileWidth}
                          cols={gameMap.cols}
                          rows={gameMap.rows}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
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
        <div className={`${styles.exit}`}>
          <Button
            btnText="EXIT"
            className={` ${styles.btn}  cancel`}
            cKBtn
            onClick={() =>
              exitLobby(currentUsername, currentLobby?.uuid || "undefined")
            }
          />
        </div>
      )}
    </div>
  );
}
