"use client";
import { useEffect, useState } from "react";

import styles from "./lobby-session.module.css";

import PacmanLoader from "react-spinners/PacmanLoader";

import { useRouter } from "next/navigation";

import { useCustomQuery, useGameMap, useScoreTracker } from "@/shared/hooks";

import { CollectionName, Lobby, Session, UserSession } from "@/shared/types";

import { MapLayout, Button, MembersDisplay } from "@/shared/components";

import { firebaseService } from "@/shared/services";

import { myAudioProvider } from "@/shared/aux-classes";

const TILE_WIDTH: number = 10;
const LOADING_LOBBY_TIME: number = 2000;
const session: Session = UserSession.getInstance();

export default function Page({ params }: { params: { lobbyId: string } }) {
  //Page states
  const [isClick, setIsClicked] = useState<boolean>(false);
  const { clearAll } = useScoreTracker();
  const { fetchMap, gameMap } = useGameMap();
  const [loading, setLoading] = useState<boolean>(true);
  const [lobby, setLobby] = useState<Lobby | null>(null);
  //Custom hooks
  const { leaveLobby, createGame } = useCustomQuery();
  const router = useRouter();
  //Start Page Logic
  const errorFn = () => {
    router.push("/404");
  };

  const goBackToIntroPage = () => {
    session.endSession();
    session.saveInSessionStorage();
    router.push("/");
  };

  const leaveLobbyHandler = async () => {
    await leaveLobby({
      username: session.getSession().username,
      lobbyId: session.getSession().lobbyId,
    });
    goBackToIntroPage();
  };

  const routerToRoulette = (lobby: Lobby) => {
    router.push(`${lobby.id}/gamePrep/${lobby.gameId}`);
  };

  const prepareGame = (lobby: Lobby) => {
    setIsClicked(true);
    createGame({
      lobbyId: lobby.id,
    });
    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  useEffect(() => {
    if (!lobby) return;

    fetchMap(lobby?.mapId);

    if (!session.getSession().playerId) {
      const playerId = lobby.members.findIndex(
        (member) => member.username === session.getSession().username
      );
      if (playerId < 0)
        throw new Error("player not found in the members array");
      session.setPlayerId(String(playerId+1));
      session.saveInSessionStorage()
    }

    //Move to roulette map when game start
    if (
      lobby.gameStarted &&
      lobby.gameId &&
      session.getSession().lobbyId === lobby.id
    ) {
      session.joinGame(lobby.gameId);
      session.setLobbyHost(lobby.hostUsername);
      session.saveInSessionStorage();
      routerToRoulette(lobby);
    }

    setTimeout(() => {
      setLoading(false);
    }, LOADING_LOBBY_TIME);
  }, [lobby]);

  useEffect(() => {
    //WebSockets Init
    const lobbySubscription = firebaseService.getRealTimeDocument(
      CollectionName.LOBBIES,
      params.lobbyId,
      (data: Lobby) => setLobby(data),
      () => errorFn()
    );

    //AudioLogic
    myAudioProvider.playIntroSongMusic(true);

    if (!session.getSession()?.lobbyId) {
      console.error("Not part of these lobby");
      router.push("/lobby");
      return;
    }

    const sessionUsername: string = session.getSession().username;

    if (!sessionUsername) return router.push("/lobby");

    clearAll();

    return () => {
      console.log("eliminating web socket...");
      lobbySubscription();
      myAudioProvider.playIntroSongMusic(false);
    };
  }, []);

  return (
    <div className="body">
      <div className={`card ${styles.card}`}>
        {!loading && (
          <div className={styles.header_container}>
            <div className={styles.title}>
              {!lobby?.deletedAt ? "WAITING LOBBY" : "LOBBY CLOSED"}
              {lobby?.deletedAt && (
                <div className={styles.img_container}>
                  <img
                    src={
                      "https://archive.org/download/pac-man-art-assortment/PAC-MAN%20BOW.png"
                    }
                    alt="Not found"
                    className={styles.image}
                  />
                  <Button
                    cKBtn={true}
                    btnText={"BACK"}
                    className={`${styles.btn} cancel`}
                    onClick={() => goBackToIntroPage()}
                  />
                </div>
              )}
            </div>
            {!lobby?.deletedAt && (
              <div className={styles.code_container}>{`# ${lobby?.code}`}</div>
            )}
          </div>
        )}
        {!loading && lobby && !lobby.deletedAt ? (
          <div className={styles.lobby_card}>
            <div className={styles.lobby_container}>
              <MembersDisplay lobby={lobby} />
              <div className={styles.btn_container}>
                {session.getSession().username === lobby.hostUsername && (
                  <Button
                    btnText={!isClick ? `START ROULETTE` : `PREPARING...`}
                    className={`${styles.btn} continue`}
                    cKBtn
                    onClick={() => prepareGame(lobby)}
                    disabled={isClick}
                    cssStyle={{ pointerEvents: `${isClick ? "none" : "auto"}` }}
                  />
                )}
                <Button
                  btnText="🚪 LEAVE"
                  className={` ${styles.btn}  cancel`}
                  cKBtn
                  onClick={() => leaveLobbyHandler()}
                />
              </div>
            </div>
            <div id={styles.map} className={styles.lobby_container}>
              <div className={styles.map_container}>
                {gameMap && (
                  <MapLayout tilesHeight={TILE_WIDTH} gameMap={gameMap} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${styles.loading} ${
              lobby?.deletedAt && styles.inactive
            }`}
          >
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
