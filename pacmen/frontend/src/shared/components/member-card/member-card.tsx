"use client";

import { FC, useEffect, useState } from "react";

import { Button } from "../buttons";

import { useCustomQuery } from "@/shared/hooks";

import { Direction, GhostTypes, MemberCardProps, Session, UserSession } from "@/shared/types";

import styles from "./member-card.module.css";

import { GhostSprite } from "../player-sprites";

import { useLobbyLeaveMutation } from "@/shared/services/tanstack-query";

const ghostSelector: { [key: string]: GhostTypes } = {
  blinky: GhostTypes.BLINKY,
  inky: GhostTypes.INKY,
  clyde: GhostTypes.CLYDE,
  pinky: GhostTypes.PINKY,
  stinky:GhostTypes.STINKY,
  purpky:GhostTypes.PURPKY

};

const session:Session = UserSession.getInstance()

export const MemberCard: FC<MemberCardProps> = ({
  username,
  isHost,
  playerNumber,
  hostUsername,
  lobbyId,
  ghostType
}) => {
  const [ghost, setGhost] = useState<GhostTypes>(GhostTypes.BLINKY);
  const [npc, setNPC] = useState<boolean>(false);
  const {updateGhostType} = useCustomQuery()

  const { mutate } = useLobbyLeaveMutation({
    onSuccess: () => {
      console.log(`user ${username} leave the lobby`);
    },
    onError: () => {
      console.error("Error exiting the lobby");
    },
  });

  const ghostArray: GhostTypes[] = [
    GhostTypes.CLYDE,
    GhostTypes.INKY,
    GhostTypes.PINKY,
    GhostTypes.BLINKY,
    GhostTypes.STINKY,
    GhostTypes.PURPKY
  ];

  const changeGhost = (direction: "up" | "down") => {
    const numGhost = ghostArray.length;
    const index = ghostArray.findIndex((ghostType) => ghostType === ghost);
    let nextIndex = (index + (direction === "up" ? 1 : -1)) % numGhost;
    if (nextIndex < 0) nextIndex = numGhost - 1;
    updateGhostType({
      lobbyId: lobbyId,
      userIndex: String(playerNumber-1),
      ghostType: ghostArray[nextIndex]
    })
    setGhost(ghostArray[nextIndex]);
  };

  const checkNPC = (username: string): boolean => {
    if (
      username === "blinky" ||
      username === "inky" ||
      username === "clyde" ||
      username === "pinky"
    ) {
      return true;
    }

    return false;
  };

  const deletePlayer = async (username: string) => {
    mutate({ username, lobbyId });
  };

  useEffect(() => {
    setNPC(checkNPC(username));
  },[username]);

  return (
    <div className={styles.card}>
      <span>P{playerNumber}</span>
      <div className={styles.avatar_container}>
        {!npc && session.getSession().username === username && (
          <Button
            btnText="<"
            cKBtn={false}
            className={styles.btn}
            onClick={() => changeGhost("down")}
          />
        )}
        <GhostSprite
          state={0}
          type={ghostSelector[ghostType||GhostTypes.BLINKY]}
          direction={Direction.RIGHT}
          scale={0.8}
          fps={8}
        />
        {!npc && session.getSession().username === username &&(
          <Button
            btnText=">"
            cKBtn={false}
            className={styles.btn}
            onClick={() => changeGhost("up")}
          />
        )}
      </div>
      <div className={styles.username_container}>
        {`${username} `} {isHost && "👑"}
        {session.getSession().username === hostUsername && username !== hostUsername && (
          <Button
            btnText="🗑"
            className={styles.delete_btn}
            cKBtn={true}
            onClick={() => deletePlayer(username)}
          />
        )}
      </div>
    </div>
  );
};
