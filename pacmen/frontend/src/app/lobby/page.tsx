"use client";

import Link from "next/link";

import { Button } from "../../shared/components";

import styles from "./lobbyPage.module.css";

import { myAudioProvider, SessionStorage } from "@/shared/aux-classes";

import { useEffect } from "react";

import { SessionStorageName } from "@/shared/types";

export default function LobbyPage() {
  useEffect(() => {
    myAudioProvider.playIntroSongMusic(true);
    SessionStorage.eliminateValue(SessionStorageName.ACTIVE_MEMBER);
    SessionStorage.eliminateValue(SessionStorageName.GAME_ID);
    SessionStorage.eliminateValue(SessionStorageName.LOBBY_ID);
  }, []);

  return (
    <div className="body">
      <div className={`card ${styles.card}`}>
        <div className={styles.btn_column}>
          <p className={styles.btn_label}>HOST</p>
          <div className={styles.btn_container}>
            <Link href={"/username"}>
              <Button
                cKBtn={true}
                btnText={"CREATE GAME"}
                className={`${styles.btn} continue`}
              />
            </Link>
          </div>
          <p className={styles.btn_label}>PUBLIC</p>
          <div className={styles.btn_container}>
            <Link href={"/lobby/public"}>
              <Button
                cKBtn={true}
                btnText={"FIND GAME"}
                className={`${styles.btn} continue`}
              />
            </Link>
          </div>
          <p className={styles.btn_label}>PRIVATE</p>
          <div className={styles.btn_container}>
            <Link href={"/lobby/private"}>
              <Button
                cKBtn={true}
                btnText={"ENTER CODE"}
                className={`${styles.btn} continue`}
              />
            </Link>
          </div>
        </div>
      </div>
      {/* <div className={`${styles.btn_cancel}`}>
          <Link href={"/"}>
            <Button
              cKBtn={true}
              btnText={"BACK"}
              className={` cancel ${styles.btn}`}
            />
          </Link>
        </div> */}
    </div>
  );
}
