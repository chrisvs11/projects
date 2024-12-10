import { FC } from "react";

import styles from "./direction-card.module.css";
import { Direction } from "@/shared/types";

interface DirectionCardProps {
  currentDirection: Direction | null;
  nextDirection: Direction | null;
}

export const DirectionCard: FC<DirectionCardProps> = ({
  currentDirection,
  nextDirection,
}) => {
  // const directionToArrowHas: { [key in Direction]: string } = {
  //   [Direction.UP]: "↑",
  //   [Direction.DOWN]: "↓",
  //   [Direction.RIGHT]: "→",
  //   [Direction.LEFT]: "←",
  // };

  return (
    <div>
      <p>Direction Queue:</p>
      <div className={styles.direction_text}>
        <p>CURRENT:</p>
        <p className={styles.icon}>{currentDirection ? currentDirection: null}</p>
        <p>NEXT:</p>
        <p className={styles.icon}>{nextDirection ? nextDirection: null }</p>
      </div>
    </div>
  );
};
