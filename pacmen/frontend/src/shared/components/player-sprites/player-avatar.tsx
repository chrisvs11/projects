import { AvatarProps, Direction, GameRole, hashGhostType, RecCoordinates } from "@/shared/types";

import { FC, useEffect, useState } from "react";

import { GhostSprite } from "./ghost-sprite";

import { PacmanSprite } from "./pacman-sprite";

import styles from "./player-avatar.module.css";

import { useGameMap } from "@/shared/hooks";

export const PlayerAvatar: FC<AvatarProps> = ({
  offsetX,
  offsetY,
  tileWidth,
  position,
  playerNum,
  ghostType,
  role,
  state,
  direction = Direction.RIGHT,
  scale = 1,
  className,
}) => {

  const [rec,setRec] = useState<RecCoordinates>()

  const { getRecCoordinates } = useGameMap();



  useEffect(() => {
    setRec(getRecCoordinates(position,tileWidth))
  },[position,tileWidth])

  return (
    <div className={`${styles.avatar_container} ${className}`} style={{left: `${(rec?.left||0)+offsetX}px`, top:`${(rec?.top||0)+offsetY}px`}}>
      <div className={styles.player_icon}>P{playerNum}</div>
      {role === GameRole.GHOST ? (
        <GhostSprite
          state={state}
          type={hashGhostType[ghostType]}
          direction={direction}
          scale={scale}
        />
      ) : (
        <PacmanSprite state={state} scale={scale} direction={direction}/>
      )}
    </div>
  );
};
