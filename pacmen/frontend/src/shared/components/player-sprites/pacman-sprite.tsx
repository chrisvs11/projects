"use client"
import { CSSProperties, FC, ReactElement } from "react";

import { SpriteAnimator } from "../sprite-animator";

import spriteImage from "../../../../public/images/sprites.png";

import { Direction, PacmanProps, PlayerState } from "@/shared/types";


const PACMAN_SPRITE_VELOCITY:number = 15
interface PacmanSpriteOrientation {
  rotation:number,
  scaleX:number,
  scaleY:number,
}
const rotationHash:{[key:string]:PacmanSpriteOrientation} = {
  [Direction.RIGHT]:{rotation:0, scaleX:1, scaleY:1},
  [Direction.LEFT]:{rotation:0, scaleX:-1, scaleY:1},
  [Direction.UP]:{rotation:-90, scaleX:1, scaleY:1},
  [Direction.DOWN]:{rotation:-90, scaleX:1, scaleY:-1}
}

export const PacmanSprite: FC<PacmanProps> = ({ state,direction = Direction.RIGHT, velocity=1, scale=1}) => {

  const fps = PACMAN_SPRITE_VELOCITY * Math.abs(velocity) 

  const FRAME_WIDTH:{x:number,y:number} = {x:38,y:50}

  const finalTransform:PacmanSpriteOrientation = state === PlayerState.DEAD ? {rotation:0, scaleX:1, scaleY:1} : rotationHash[direction]

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

  const cssProperties:CSSProperties = {transform:`scaleX(${finalTransform.scaleX})  scaleY(${finalTransform.scaleY}) rotate(${finalTransform.rotation/360}turn)`}

  return (

    <div style={cssProperties}>
      {pacmanSpriteSelector()}
    </div>

  );
};
