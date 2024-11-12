import { FC } from "react";
import { GhostSprite, PacmanSprite } from "../..";
import { Direction, GhostTypes, PlayerState } from "@/shared/types";
import styles from "./ghosts-win.module.css";

export const GhostsWinSlider: FC = () => {
  return (
    <div className={styles.list}>
      <div id={styles.pacman}>
        <PacmanSprite state={PlayerState.ALIVE} rotation={180} />
      </div>
      <GhostSprite
        state={PlayerState.ALIVE}
        type={GhostTypes.BLINKY}
        direction={Direction.LEFT}
        scale={1}
      />
      <GhostSprite
        state={PlayerState.ALIVE}
        type={GhostTypes.INKY}
        direction={Direction.LEFT}
        scale={1}
      />
      <GhostSprite
        state={PlayerState.ALIVE}
        type={GhostTypes.PINKY}
        direction={Direction.LEFT}
        scale={1}
      />
      <GhostSprite
        state={PlayerState.ALIVE}
        type={GhostTypes.CLYDE}
        direction={Direction.LEFT}
        scale={1}
      />
    </div>
  );
};
