"use client"

import { FC } from "react";
import styles from "./public-lobby-card.module.css";
import { Button } from "../button";
import { Lobby } from "@/shared/types";
import { useRouter } from "next/navigation";
import { useUsername } from "@/shared/hooks/username.hook";
import { useLobbyId } from "@/shared/hooks";

interface LobbyCardProps {
  hostName: string;
  maxPlayers: number;
  currentMembers: number;
  lobbyId: string;
}

const pacmanImage: string =
  "data:image/png;base64,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";
const playerImage: string =
  "https://seeklogo.com/images/P/pacman-ghost-logo-4E0E79293D-seeklogo.com.png";

export const PublicLobbyCard: FC<LobbyCardProps> = ({
  hostName,
  maxPlayers,
  currentMembers,
  lobbyId,
}) => {

  const router = useRouter()
  const {setLobbyId} = useLobbyId()

  const clickHandler = () => {
    setLobbyId(lobbyId)
    router.push("/username")
  }

  // const joinHandler = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/lobbies/public/${lobbyId}/${username}`,
  //       {
  //         method:"POST"
  //       }
  //     );

  //     if (!response.ok) throw new Error("Cannot join lobby");
      
  //     const data:Lobby = await response.json()

  //     router.push(`${data.uuid}`)

  //   } catch (e) {

  //     console.error("Error: ", e)

  //   }
  // };

  return (
    <div className={styles.lobby_info_card}>
      <p className={styles.lobbyInfo}>
        <img className={styles.image} src={pacmanImage} alt="" />
        {hostName}
      </p>
      <p className={styles.lobbyInfo}>
        <img src={playerImage} alt="" className={styles.image} />{" "}
        {currentMembers} / {maxPlayers}{" "}
      </p>
      <Button
        cKBtn
        btnText="Join"
        CKColorSchema="blue"
        className={"btn3"}
        onClick={clickHandler}
      />
    </div>
  );
};
