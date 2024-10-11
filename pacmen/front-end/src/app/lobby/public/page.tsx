"use client";
import React, { useEffect, useState } from "react";

import { CollectionNames, Lobby, LobbyType } from "../../../shared/types";

import { Button, PublicLobbyCard } from "../../../shared/components";

import styles from "./public.module.css";

import Link from "next/link";

import FirebaseService from "@/shared/services/firebase-service";

import RingLoader from "react-spinners/RingLoader";

const firebaseService = new FirebaseService();

export default function LobbyPage() {
  const [fetchedLobby, setFetchLobby] = React.useState<Lobby[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { unsubscribe } = firebaseService.getRealTimeDocuments(
      CollectionNames.LOBBIES,
      (data) => {
        setFetchLobby(data);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="body">
      <div className={"card"}>
        <div className={styles.title}>Public Lobbies</div>
        <div className={styles.lobby_card}>
          <div className={styles.headers}>
            <p>Host Name</p>
            <p>Players/MaxPlayers</p>
          </div>
          {!loading ? (
            fetchedLobby.map((lobby, index) => {
              if (
                lobby.maxPlayers > lobby.members.length &&
                lobby.type === LobbyType.PUBLIC
              ) {
                return (
                  <PublicLobbyCard
                    key={index}
                    hostName={lobby.hostUsername}
                    maxPlayers={lobby.maxPlayers}
                    currentMembers={lobby.members.length}
                    lobbyId={lobby.id}
                  />
                );
              } else {
                return;
              }
            })
          ) : (
            <div className={styles.loading}>
              <RingLoader speedMultiplier={1} loading={loading} />
            </div>
          )}
        </div>
        <Link href={"/lobby"}>
          <Button
            cKBtn
            btnText="Cancel"
            className="cancel"
            CKColorSchema="orange"
          />
        </Link>
      </div>
    </div>
  );
}
