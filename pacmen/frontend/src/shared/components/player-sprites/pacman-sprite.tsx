"use client"
import { FC, ReactElement } from "react";

import { SpriteAnimator } from "../sprite-animator";

import spriteImage from "../../../../public/images/sprites.png";

import { PacmanProps, PlayerState } from "@/shared/types";


const PACMAN_SPRITE_VELOCITY:number = 15

export const PacmanSprite: FC<PacmanProps> = ({ state,rotation=0, velocity=1, scale=1}) => {

  const fps = PACMAN_SPRITE_VELOCITY * Math.abs(velocity) 

  const FRAME_WIDTH:{x:number,y:number} = {x:50,y:50}

  const finalRotation = state === PlayerState.DEAD ? 0 : rotation

  function pacmanSpriteSelector(): ReactElement {
    switch (state) {
      case PlayerState.ALIVE:
        return (
          <SpriteAnimator
            src={spriteImage.src}
            frameWidth={FRAME_WIDTH}
            numFrames={3}
            fps={fps}
            offsetX={850}
            offsetY={0}
            loopType="loop"
            spriteDirection="vertical"
            scale={scale}
          />
        );
      case PlayerState.DEAD:
        return (
          <SpriteAnimator
            src={spriteImage.src}
            frameWidth={FRAME_WIDTH}
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
            frameWidth={FRAME_WIDTH}
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

    <div style={{transform:`rotate(${finalRotation/360}turn)`}}>
      {pacmanSpriteSelector()}
    </div>

  );
};
