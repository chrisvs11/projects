"use client";
import { FC, useEffect, useState } from "react";

import { GhostSprite, PacmanSprite } from "../..";

import { Direction, GhostTypes, PlayerState } from "@/shared/types";

import styles from "./tie.slider.module.css";

export const TieSlider: FC = () => {
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [, setRotation] = useState<number>(0);
  let index = 0;

  useEffect(() => {
    const Directions: Direction[] = [
      Direction.UP,
      Direction.RIGHT,
      Direction.DOWN,
      Direction.LEFT,
    ];
    const timer = setInterval(() => {
      index++;
      const newDirection: Direction = Directions[index % Directions.length];
      setDirection(newDirection);
      setRotation((prev) => (prev === 0 ? 180 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  return (
    <div className={styles.list}>
      <GhostSprite
        state={PlayerState.ALIVE}
        type={GhostTypes.BLINKY}
        direction={direction}
        scale={1}
      />
      <GhostSprite
        state={PlayerState.ALIVE}
        type={GhostTypes.INKY}
        direction={direction}
        scale={1}
      />
      <div id={styles.pacman}>
        <PacmanSprite state={PlayerState.ALIVE} />
      </div>

      <GhostSprite
        state={PlayerState.ALIVE}
        type={GhostTypes.PINKY}
        direction={direction}
        scale={1}
      />
      <GhostSprite
        state={PlayerState.ALIVE}
        type={GhostTypes.CLYDE}
        direction={direction}
        scale={1}
      />
    </div>
  );
};
