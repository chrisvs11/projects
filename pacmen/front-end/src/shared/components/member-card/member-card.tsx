"use client";

import { FC, useEffect, useState } from "react";

import { Button } from "../button";

import { useUsername } from "@/shared/hooks";

import { Direction, GhostTypes, MemberCardProps } from "@/shared/types";

import styles from "./member-card.module.css";

import { GhostSprite } from "../player-sprites";

import { useLobbyLeaveMutation } from "@/shared/services/tanstack-query";

const ghostSelector: { [key: string]: GhostTypes } = {
  blinky: GhostTypes.BLINKY,
  inky: GhostTypes.INKY,
  clyde: GhostTypes.CLYDE,
  pinky: GhostTypes.PINKY,
};

export const MemberCard: FC<MemberCardProps> = ({
  username,
  position,
  isHost,
  hostUsername,
  lobbyId,
}) => {
  const [ghost, setGhost] = useState<GhostTypes>(GhostTypes.BLINKY);
  const [npc, setNPC] = useState<boolean>(false);
  const { username: currentUsername } = useUsername();

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
  ];

  const changeGhost = (direction: "up" | "down") => {
    const numGhost = ghostArray.length;
    const index = ghostArray.findIndex((ghostType) => ghostType === ghost);
    let nextIndex = (index + (direction === "up" ? 1 : -1)) % numGhost;
    if (nextIndex < 0) nextIndex = numGhost - 1;
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
  });

  return (
    <div className={styles.card}>
      <div className={styles.username_container}>
        {currentUsername === hostUsername && (
          <Button
            btnText="🗑"
            className={styles.delete_btn}
            cKBtn={true}
            onClick={() => deletePlayer(username)}
          />
        )}
        {`${position}. ${username} `} {isHost && "👑"}
      </div>
      <div className={styles.avatar_container}>
        {!npc && (
          <Button
            btnText="<"
            cKBtn={false}
            className={styles.btn}
            onClick={() => changeGhost("down")}
          />
        )}
        <GhostSprite
          state={0}
          type={!npc ? ghost : ghostSelector[username]}
          direction={Direction.RIGHT}
          scale={0.7}
          fps={8}
        />
        {!npc && (
          <Button
            btnText=">"
            cKBtn={false}
            className={styles.btn}
            onClick={() => changeGhost("up")}
          />
        )}
      </div>
    </div>
  );
};
