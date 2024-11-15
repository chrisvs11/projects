"use client";

import { useEffect, useState } from "react";

import styles from "./lobby-session.module.css";

import FirebaseService from "@/shared/services/firebase-service";

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

import { CollectionNames, GameMap, Lobby } from "@/shared/types";

import { MemberCard, MapLayout, Button } from "@/shared/components";

import { GameAudios } from "@/shared/aux-classes";

const firebaseService = new FirebaseService();

const TILE_WIDTH: number = 10;

export default function Page({ params }: { params: { lobbyId: string } }) {
  const gameAudios = new GameAudios();
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);
  const [isClick,setIsClicked] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true);
  const { gameMap, updateGameMap, mapTiles, setMapTiles } = useMapLayout();
  const { getNPCName } = useNPC();
  const { setLobbyId } = useLobbyId();
  const { addNPCToLobby, leaveLobby, createGame } = useCustomQuery();
  const { username: currentUsername, setUsername } = useUsername();
  const { playerId, setPlayerId } = usePlayer();
  const [tileWidth, setTileWidth] = useState<number>(TILE_WIDTH);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const router = useRouter();

  async function setGameMap() {
    try {
      if (!currentLobby) throw new Error("Cannot find lobby number");

      const gameMap = (await firebaseService.getData(
        CollectionNames.MAPS,
        currentLobby.mapId
      )) as GameMap; 

      updateGameMap(gameMap)
      setTimeout(() => {
        setLoading(false)
      }, 2000);

    } catch (e) {
      console.error("Error: ", e);
      return null
    }
  }

 

  const addNPC = () => {
    if (!currentLobby) return;
    const npcName = getNPCName(currentLobby);
    if (npcName) addNPCToLobby({ username: npcName, lobbyId: params.lobbyId });
  };

  const exitLobby = (username: string, lobbyId: string) => {
    leaveLobby({ username, lobbyId });
    setLobbyId(null);
    setUsername("");
    router.push("/");
  };

  const startGame = () => {
    setIsClicked(true)
    createGame({ lobbyId: params.lobbyId });
  };

  useEffect(() => {
    const newTileWidth =
      windowWidth >= 700 ? TILE_WIDTH : windowWidth >= 200 ? 8.5 : 6;
    setTileWidth(newTileWidth);
  }, [windowWidth]);

  useEffect(() => {
    if (!currentLobby) return;

    setGameMap()

    if(currentLobby.gameStarted && currentLobby.gameId) {
      console.log(`ENTERING GAME....${currentLobby.gameId}`)
      router.push(`/lobby/${currentLobby.id}/game/${currentLobby.gameId}`);
    }
    if (currentUsername && !playerId) {
      const playerIndex: number = currentLobby.members.findIndex(
        (member) => member.username === currentUsername
      );
      if (playerIndex >= 0) {
        setPlayerId(String(playerIndex + 1));
      }
    }
  }, [currentLobby]);

  useEffect(() => {
    gameAudios.stopAllMusic();
    gameAudios.introSongMusicStart();
  }, []);

  useEffect(() => {
    if (!gameMap) return;
    setMapTiles(gameMap.tiles);
  }, [gameMap]);

  const errorFn = () => {
    router.push("/404");
  };

  

  useEffect(() => {
    const lobbySubscription = firebaseService.getRealTimeDocument(
      CollectionNames.LOBBIES,
      params.lobbyId,
      (data:Lobby) => setCurrentLobby(data),
      () => errorFn()
    );

    setWindowWidth(window.innerWidth)

    function resize() {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize",resize)

    return () => {
      lobbySubscription();
      window.removeEventListener("resize",resize)
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
                {currentUsername === currentLobby.hostUsername && <Button
                  cKBtn
                  btnText="👻+"
                  className={styles.add_btn}
                  onClick={() => addNPC()}
                />}
              </div>
              <div className={styles.btn_container}>
              {currentUsername === currentLobby.hostUsername && <Button
                  btnText={currentLobby.members.length < currentLobby.maxPlayers ? "Pending Players" : !isClick ? `START`: `Processing...`}
                  className={`${styles.btn} continue ${currentLobby.members.length < currentLobby.maxPlayers && styles.no_active_btn}`}
                  cKBtn
                  onClick={() => startGame()}
                  disabled = {isClick}
                  cssStyle={{pointerEvents:`${isClick ? "none" :"auto"}`}}
                />}
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
            onClick={() => exitLobby(currentUsername, currentLobby?.uuid||"undefined")}
          />
        </div>
      )}
    </div>
  );
}
