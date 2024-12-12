"use client";
import { FC, useEffect, useState } from "react";

import styles from "./members-display.module.css";

import { Lobby, Session, UserSession } from "@/shared/types";

import { Button, MemberCard } from "..";

import { useCustomQuery, useNPC } from "@/shared/hooks";


interface MembersDisplayProps {
  lobby: Lobby;
}

const session:Session = UserSession.getInstance()

export const MembersDisplay: FC<MembersDisplayProps> = ({
  lobby,
}) => {
  const { getNPCName } = useNPC();
  const [isClickable, setIsClickable] = useState<boolean>(true);
  const [isLobbyFull, setIsLobbyFull] = useState<boolean>(false);
  const [noNPC,setNoNPC] = useState<boolean>(false)
  const { addNPCToLobby } = useCustomQuery();
  const LOADING_TIME: number = 250;

  const addNPC = async (lobby: Lobby) => {
    const npcName = getNPCName(lobby);
    if (!npcName) {
      return setNoNPC(true)
    }
    setIsClickable(false);
    try {
      await addNPCToLobby({ username: npcName, lobbyId: lobby.id });
      const isLobbyFull = lobby.members.length === lobby.maxPlayers;
      if (!isLobbyFull) {
        setTimeout(() => {
          setIsClickable(true);
        }, LOADING_TIME);
      }
    } catch (e) {
      console.error("ERROR on adding NPC");
      setIsClickable(true);
    }
  };

  useEffect(() => {
    setIsLobbyFull(lobby.members.length === lobby.maxPlayers);
  }, [lobby]);

  return (
    <>
      <div className={styles.members_container}>
        <div className={styles.member_cards_container}>
          {lobby.members.map((member, index) => (
            <MemberCard
              key={index}
              username={member.username}
              playerNumber={index + 1}
              isHost={member.username === lobby.hostUsername}
              hostUsername={lobby.hostUsername}
              lobbyId={lobby.id}
              ghostType={member.type}
            />
          ))}
        </div>
        { session.getSession().username === lobby.hostUsername && (
          <div className={styles.add_btn_container}>
            <Button
              cKBtn
              btnText="👻+"
              className={`${styles.add_btn} ${
                (!isClickable || isLobbyFull || noNPC) && styles.disabled
              }`}
              onClick={() => addNPC(lobby)}
            />
            <p className={`${styles.error_message} ${ noNPC && styles.active} `}>No more NPC</p>
          </div>
        )}
      </div>
    </>
  );
};
