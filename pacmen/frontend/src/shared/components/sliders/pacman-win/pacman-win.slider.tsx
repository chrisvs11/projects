import { FC } from "react";
import { GhostSprite, PacmanSprite } from "../..";
import { Direction, GhostTypes, PlayerState } from "@/shared/types";
import styles from "./pacman-win.module.css"

export const PacmanWinSlider:FC = () => {
    return (
        <div className={styles.list}>
        <div className={styles.pacman}>
        <PacmanSprite state={PlayerState.ALIVE} />
        </div>
        <GhostSprite
          state={PlayerState.ALIVE}
          type={GhostTypes.BLINKY}
          direction={Direction.RIGHT}
          scale={1}
        />
        <GhostSprite
          state={PlayerState.ALIVE}
          type={GhostTypes.INKY}
          direction={Direction.RIGHT}
          scale={1}
        />
        <GhostSprite
          state={PlayerState.ALIVE}
          type={GhostTypes.PINKY}
          direction={Direction.RIGHT}
          scale={1}
        />
        <GhostSprite
          state={PlayerState.ALIVE}
          type={GhostTypes.CLYDE}
          direction={Direction.RIGHT}
          scale={1}
        />
      </div>
    )
} 