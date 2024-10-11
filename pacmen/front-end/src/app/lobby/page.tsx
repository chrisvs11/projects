"use client"

import Link from "next/link";

import { Button } from "../../shared/components";

import styles from "./lobbyPage.module.css";

export default function LobbyPage() {
  return (
    <div className="body">
      <div className={"card"}>
      <div className={styles.title}>Select the Type of Lobby</div>
        <div className={styles.btn_column}>
          <Link href={"/username"}>
            <Button cKBtn={true} btnText={"New"} className={styles.btn} />
          </Link>
          <Link href={"/lobby/public"}>
            <Button cKBtn={true} btnText={"Public"} className={styles.btn} />
          </Link>
          <Link href={"/lobby/private"}>
            <Button cKBtn={true} btnText={"Private"} className={styles.btn} />
          </Link>
        </div>
        <div className="cancel">
          <Link href={"/"}>
            <Button cKBtn={true} btnText={"Cancel"} className={styles.cancel} />
          </Link>
        </div>
      </div>
    </div>
  );
}
