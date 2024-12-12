import { FC,  useState } from "react";

import { GhostSprite, PacmanSprite } from "../player-sprites";

import { Direction, GameRole, GhostTypes, PlayerState } from "@/shared/types";

import styles from "./roulette_avatar.module.css";

import { Button } from "../buttons";

import { useCustomQuery } from "@/shared/hooks";

interface RouletteAvatarProps {
  username: string;
  localUsername:string;
  role: GameRole;
  type: GhostTypes;
  rouletteEnded: boolean;
  ready?: boolean;
  gameId: string;
}

export const RouletteAvatar: FC<RouletteAvatarProps> = ({
  username,
  localUsername,
  role,
  type,
  ready,
  gameId,
  rouletteEnded,
}) => {

  const { readyPlayer } = useCustomQuery();
  const [, setDataSent] = useState<boolean>(false)
 
  const clickHandler = async() => {
    try {
    const result = await readyPlayer({
      gameId,
      username:localUsername,
    })
    if(result) setDataSent(true)
  }catch(e) {
    console.log(e)
  }
  }

  return (
    <div className={styles.card}>
      {
        <div
          className={`${styles.selector} ${
            role === GameRole.PACMAN && styles.active_selector
          }`}
        >
          <span style={{"--i":"0"} as React.CSSProperties}></span>
          <span style={{"--i":"1"} as React.CSSProperties}></span>
          <span style={{"--i":"2"} as React.CSSProperties}></span>
          <span style={{"--i":"3"} as React.CSSProperties}></span>
        </div>
      }
      <div className={styles.username_container}>{username}</div>
      <div className={`${styles.player_avatar} ${rouletteEnded && role === GameRole.PACMAN && styles.animate}`}>
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
      {localUsername === username ? (
        <>
          <Button
            id={"ready_btn"}
            cKBtn={false}
            btnText={`READY`}
            className={`${styles.start_btn}  ${ready && styles.animating}`}
            onClick={() => clickHandler()}
          />
          <div id={"check"}className={`${styles.checkmark_container} ${ready ? styles.animating : ""}`}>
            <svg
              x="0px"
              y="0px"
              className={styles.checkmark_svg}
              fill="none"
              viewBox="0 0 25 30"
            >
              <path d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2" />
            </svg>
          </div>
        </>
      ) : (
        <>
        <Button
          id={"ready_btn"}
          cKBtn={false}
          btnText={`${ready ? "✔️" : "READY ?"}`}
          className={`${styles.start_btn}  ${ready ? styles.animating : ""}`}
        />
        <div id={"check"}className={`${styles.checkmark_container} ${ready ? styles.animating : ""}`}>
          <svg
            x="0px"
            y="0px"
            className={styles.checkmark_svg}
            fill="none"
            viewBox="0 0 25 30"
          >
            <path d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2" />
          </svg>
        </div>
      </>
      )}
    </div>
  );
};
