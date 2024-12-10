"use client";
import { FC, useEffect, useMemo, useState } from "react";

import { SpriteAnimator } from "../sprite-animator";

import Sprites from "../../../../public/images/sprites.png";

import { GhostProps, PlayerState } from "@/shared/types";

import styles from "./ghost.module.css";

import { GhostSpriteSelector } from "@/shared/aux-classes";

export const GhostSprite: FC<GhostProps> = ({
  state,
  type,
  direction,
  fps = 16,
  scale,
}) => {
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [numFrames, setNumFrames] = useState<number>(2);
  
  const ghostSprite = useMemo(() => new GhostSpriteSelector(),[]);

  useEffect(() => {
    setOffsetX(ghostSprite.getOffset(state, type,direction).x);
    setOffsetY(ghostSprite.getOffset(state, type,direction).y);
    const frames = state !== PlayerState.DEAD ? 2 : 1;
    setNumFrames(frames);
  }, [state, direction, type,ghostSprite]);

  return (
    <div className={styles.ghost} key={state}>
      <SpriteAnimator
        src={Sprites.src}
        frameWidth={{x:38,y:50}}
        numFrames={numFrames}
        fps={fps}
        offsetX={offsetX}
        offsetY={offsetY}
        spriteDirection="vertical"
        scale={Math.abs(scale)}
      />
    </div>
  );
};
