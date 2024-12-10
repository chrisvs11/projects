"use client";
import { FC, } from "react";

import styles from "./game-stats.module.css";

import { PacmanSprite } from "..";

import { GameStatsProps, PlayerState } from "@/shared/types";

import { useScoreTracker } from "@/shared/hooks";

export const GameStats: FC<GameStatsProps> = ({
  lives,
  playtime,
  playerId,
  role,
  numPellets,
}) => {
  const { scores } = useScoreTracker();

  return (
    <div className={styles.game_data}>
      <div className={styles.game_stats_card}>
        <div className={styles.pacman}>
          <PacmanSprite state={PlayerState.ALIVE} velocity={1 - 1 / 3} />
        </div>
        <p>x{lives < 0 ? 0 : lives}</p>
      </div>
      <div className={`${styles.game_stats_card} ${styles.scores}`}>
        <p> {`🟡 X ${numPellets}`}</p>
      </div>
      <div className={`${styles.game_stats_card}`}>
        You are P{playerId}: {role} !
      </div>
      <div  className={`${styles.game_stats_card} ${styles.scores_card}`}>
        <div className={`${styles.scores}`}>
          <p>Pacman Score</p> <p>{scores.pacmanScore} pts</p>
        </div>
        <div className={`${styles.scores}`}>
          <p>Ghost Score</p> <p>{scores.ghostScore} pts</p>
        </div>
      </div>

      <div className={`${styles.game_stats_card} ${styles.scores}`}>
        <p>Timer </p>
        <p>{Math.max(playtime, 0)} s</p>
      </div>
    </div>
  );
};
