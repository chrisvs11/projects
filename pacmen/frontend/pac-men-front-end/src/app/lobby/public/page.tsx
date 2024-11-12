"use client";
import React, { useEffect, useState } from "react";

import { CollectionNames, Lobby, LobbyType } from "../../../shared/types";

import { Button } from "../../../shared/components";

import styles from "./public.module.css";

import Link from "next/link";

import FirebaseService from "@/shared/services/firebase-service";

import RingLoader from "react-spinners/RingLoader";

import { useLobbyId } from "@/shared/hooks";

import { useRouter } from "next/navigation";

const firebaseService = new FirebaseService();

const playerImage: string =
  "https://seeklogo.com/images/P/pacman-ghost-logo-4E0E79293D-seeklogo.com.png";

export default function LobbyPage() {
  const [fetchedLobby, setFetchLobby] = React.useState<Lobby[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setLobbyId } = useLobbyId();
  const router = useRouter();

  const clickHandler = (lobbyId: string) => {
    setLobbyId(lobbyId);
    router.push("/username");
  };

  useEffect(() => {
    const { unsubscribe } = firebaseService.getRealTimeDocuments(
      CollectionNames.LOBBIES,
      (data:Lobby[]) => {
        setFetchLobby(data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="body">
      <div className={styles.title}>Lobbies</div>
      <div className={`card ${styles.card}`}>
        <div className={styles.lobby_card}>
          <table className={styles.lobby_table}>
            <thead>
              <th>Host Name</th>
              <th>Players</th>
              <th>Join Lobby</th>
            </thead>

            {!loading && (
              <tbody>
                {fetchedLobby.map((lobby:Lobby,index) => {
                  if (
                    lobby.maxPlayers > lobby.members.length &&
                    lobby.type === LobbyType.PUBLIC &&
                    !lobby.deletedAt
                  ) {
                    return (
                      <tr className={styles.table_row} key={index}>
                        <td className={styles.cell}>
                          <p>{lobby.hostUsername}</p>
                          <p>ID:{lobby.code}</p>
                        </td>
                        <td className={styles.cell}>
                          <img
                            src={playerImage}
                            alt=""
                            className={styles.image}
                          />
                          {`${lobby.members.length}/${lobby.maxPlayers}`}
                        </td>
                        <td>
                          <Button
                            cKBtn
                            btnText="Join"
                            className={styles.btn}
                            onClick={() => clickHandler(lobby.id)}
                          />
                        </td>
                      </tr>
                    );
                  } else {
                    return;
                  }
                })}
              </tbody>
            )}
          </table>
          {!loading &&
            !fetchedLobby.find(
              (lobby) => lobby.type === LobbyType.PUBLIC && !lobby.deletedAt
            ) && (
              <tr
                style={{
                  textAlign: "center",
                  color: "white",
                  marginBottom: "30px",
                  fontWeight: "600",
                }}
              >
                <p>NOT PUBLIC LOBBIES AVAILABLE</p>
                <p>GO ON AND HOST ONE 🕹️!!</p>
                <div className={styles.pacman}></div>
              </tr>
            )}
          {loading && (
            <div className={styles.loading}>
              <RingLoader
                speedMultiplier={1}
                loading={loading}
                color="yellow"
              />
              Loading...
            </div>
          )}
        </div>
      </div>
      <div className={styles.btn_cancel}>
        <Link href={"/lobby"}>
          <Button
            cKBtn
            btnText="BACK"
            className={`cancel`}
            CKColorSchema="orange"
          />
        </Link>
      </div>
    </div>
  );
}
