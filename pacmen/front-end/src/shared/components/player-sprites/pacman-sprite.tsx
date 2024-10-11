"use client"
import { FC, ReactElement } from "react";

import { SpriteAnimator } from "../sprite-animator";

import spriteImage from "../../../../public/images/sprites.png";

import { PacmanProps, PlayerState } from "@/shared/types";


export const PacmanSprite: FC<PacmanProps> = ({ state,rotation=0, velocity=1, scale=1}) => {

  const fps = 15 * Math.abs(velocity) 

  function pacmanSpriteSelector(): ReactElement {
    switch (state) {
      case PlayerState.ALIVE:
        return (
          <SpriteAnimator
            src={spriteImage.src}
            frameWidth={50}
            numFrames={3}
            fps={fps}
            offsetX={850}
            offsetY={0}
            loopType="loop"
            spriteDirection="vertical"
            scale={scale}
          />
        );
      case PlayerState.PACMAN_DEAD:
        return (
          <SpriteAnimator
            src={spriteImage.src}
            frameWidth={50}
            numFrames={12}
            fps={fps}
            offsetX={350}
            offsetY={0}
            loopType="loop"
            spriteDirection="vertical"
            scale={scale}
          />
        );
      default:
        return (
          <SpriteAnimator
            src={spriteImage.src}
            frameWidth={50}
            numFrames={3}
            fps={fps}
            offsetX={850}
            offsetY={0}
            loopType="loop"
            spriteDirection="vertical"
            scale={scale}
          />
        );
    }
  }



  return (

    <div style={{transform:`rotate(${rotation/360}turn)`}}>
      {pacmanSpriteSelector()}
    </div>

  );
};
