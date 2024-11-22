import { FC, useState } from "react";

import { GhostSprite, PacmanSprite } from "../player-sprites";

import { Direction, GameRole, GhostTypes, PlayerState } from "@/shared/types";

import styles from "./roulette_avatar.module.css";

import { Button } from "../buttons";

import { useCustomQuery, useUsername } from "@/shared/hooks";

interface RouletteAvatarProps {
  username: string;
  role: GameRole;
  type: GhostTypes;
  rouletteEnded:boolean
  ready?:boolean
  gameId:string
}

export const RouletteAvatar: FC<RouletteAvatarProps> = ({username,role,type, ready, gameId}) => {

  const {username:currentUsername} = useUsername()
  const {readyPlayer} = useCustomQuery()
  const [clickable,isClickable] = useState<boolean>(true)
  const clickHandler = () => {
    isClickable(false)
    console.log(`username ${currentUsername} and gameId ${gameId}`)
    readyPlayer({
      gameId,
      username:currentUsername,
    })
  }


  return (
    <div className={styles.card}>
      {<div className={`${styles.selector} ${role === GameRole.PACMAN && styles.active_selector}`}>🟡</div>}
      <div className={styles.username_container}>{username}</div>
      <div className={styles.player_avatar}>
        {role === GameRole.GHOST && (
          <GhostSprite
            state={0}
            type={type}
            direction={Direction.RIGHT}
            scale={1}
            fps={8}
          />
        )}
        {role === GameRole.PACMAN && <PacmanSprite state={PlayerState.ALIVE} />}
      </div>
      {(currentUsername === username ? <Button cKBtn={true} btnText={`${ready ? "✔️" : "PENDING"  }`} className={`${styles.ready_btn} ${ ready ?  styles.disabled:styles.ready_btn }`} disabled = {!clickable}  onClick={() => clickHandler()}/>
      : <Button cKBtn={true} btnText={`${ready ? "✔️":"PENDING"}`} className={`${styles.ready_btn} ${ready && styles.disabled}`}  disabled={true}/>
      )}
    </div>
  );
};
