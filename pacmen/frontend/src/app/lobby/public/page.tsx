"use client";
import React, { useEffect, useState } from "react";

import { CollectionName, Lobby } from "../../../shared/types";

import { Button, LobbyTable } from "../../../shared/components";

import styles from "./public.module.css";

import Link from "next/link";

import RingLoader from "react-spinners/RingLoader";

import { firebaseService } from "@/shared/services";

import { myAudioProvider } from "@/shared/aux-classes";

export default function LobbyPage() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const filteredLobbies = (lobbies: Lobby[]): Lobby[] => {
    const filteredLobby: Lobby[] = [];
    for (let i = 0; i < lobbies.length; i++) {
      const lobby = lobbies[i];
      //lobby is full
      console.log("lobby", lobby);
      if (lobby.maxPlayers === lobby.members.length) continue;
      //lobby is deleted
      if (lobby.deletedAt) continue;
      //lobby is on a game
      if (lobby.gameStarted) continue;

      filteredLobby.push(lobby);
    }
    return filteredLobby;
  };

  useEffect(() => {
    const { unsubscribe } = firebaseService.getRealTimeDocuments(
      CollectionName.LOBBIES,
      (data: Lobby[]) => {
        setLobbies(data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    );
    myAudioProvider.playIntroSongMusic(true);
    return () => unsubscribe();
  }, []);

  return (
    <div className="body">
      <div className={styles.title}>Lobbies</div>
      <div className={`card ${styles.card}`}>
        <div className={styles.lobby_card}>
          {!loading && (
            <LobbyTable availableLobbies={filteredLobbies(lobbies)} />
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
          <Button cKBtn btnText="BACK" className={`cancel`} />
        </Link>
      </div>
    </div>
  );
}
