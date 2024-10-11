"use client";
import { FC, useEffect, useState } from "react";

import { SpriteAnimator } from "../sprite-animator";

import SpriteImage from "../../../../public/images/sprites.png";

import { GhostProps, PlayerState } from "@/shared/types";

import styles from "./ghost.module.css";

import { GhostSpriteSelector } from "@/shared/aux-functions";

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
  const ghostSprite = new GhostSpriteSelector();

  useEffect(() => {

    setOffsetX(ghostSprite.getOffsetX(state, type));
    setOffsetY(ghostSprite.getOffsetY(state, direction));

    const newFrames = state !== PlayerState.GHOST_DEAD ? 2 : 1;

    setNumFrames(newFrames);
  }, [state, direction, type]);

  return (
    <div className={styles.ghost}>
      <SpriteAnimator
        src={SpriteImage.src}
        frameWidth={50}
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
