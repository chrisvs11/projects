import { AvatarProps, Direction, GameRole, hashGhostType, RecCoordinates } from "@/shared/types";

import { FC, useEffect, useState } from "react";

import { GhostSprite } from "./ghost-sprite";

import { PacmanSprite } from "./pacman-sprite";

import styles from "./player-avatar.module.css";

export const PlayerAvatar: FC<AvatarProps> = ({
  offsetX,
  offsetY,
  coordinates,
  playerNum,
  ghostType,
  role,
  state,
  direction = Direction.RIGHT,
  scale = 1,
  coordinatesToRecCoordinates,
  className,
}) => {

  const [rec,setRec] = useState<RecCoordinates>()


  const rotationHash:{[key:string]:number} = {
    [Direction.RIGHT]:0,
    [Direction.LEFT]:180,
    [Direction.UP]:-90,
    [Direction.DOWN]:-270
  }

  useEffect(() => {
    setRec(coordinatesToRecCoordinates())
  },[coordinates])

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
        <PacmanSprite state={state} scale={scale} rotation={rotationHash[direction]}/>
      )}
    </div>
  );
};
