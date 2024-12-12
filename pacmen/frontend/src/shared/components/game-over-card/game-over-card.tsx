import { FC } from "react";

import { Button, GhostsWinSlider, PacmanWinSlider, TieSlider } from "..";

import styles from "./game-over-card.module.css";
import { myAudioProvider } from "@/shared/aux-classes";
import { useCustomQuery } from "@/shared/hooks";
import { useRouter } from "next/navigation";

interface GameOverCardProps {
  lives: number;
  pacmanScore: number;
  ghostScore: number;
  lobbyId:string;
  username:string;
}

export const GameOverCard: FC<GameOverCardProps> = ({
  lives,
  pacmanScore,
  ghostScore,
  username,
  lobbyId
}) => {
  const { leaveLobby } = useCustomQuery();
  const router = useRouter();

  const exitHandler = async () => {
    try {
      await leaveLobby({
        username,
        lobbyId,
      });
      myAudioProvider.stopAllMusic();
      router.push("/lobby");
    } catch (e) {
      console.error("Error exiting...");
    }
  };

  const restartHandler = () => {
    try {
        router.push(`/lobby/${lobbyId}`);
    } catch (e) {
        console.error(e)
    }
  };

  return (
    <div className={styles.gameOver_card}>
      <p>GAME OVER</p>
      <div>
        {lives < 0 ? (
          <div className={styles.flavor_txt}>
            <p>👻PACMAN CAUGHT👻</p>
            <p>👻 GHOST WIN!👻</p>
          </div>
        ) : ghostScore > pacmanScore || lives < 0 ? (
          "👻 GHOST WIN! 👻"
        ) : pacmanScore === ghostScore ? (
          "TIE 👻🟡"
        ) : (
          "🟡 PACMAN WIN! 🟡"
        )}
      </div>
      <div className={styles.score_card}>
        <div className={styles.slider}>
          {lives < 0 ? (
            <TieSlider />
          ) : ghostScore > pacmanScore ? (
            <GhostsWinSlider />
          ) : pacmanScore === ghostScore ? (
            <TieSlider />
          ) : (
            <PacmanWinSlider />
          )}
        </div>
        <div className={styles.score}>
          <p>PACMAN: </p>
          <span>{pacmanScore} pts</span>
          <p>GHOSTS: </p>
          <p>{ghostScore} pts</p>
        </div>
        <div className={styles.btn_card}>
          <Button
            cKBtn={true}
            btnText={"EXIT"}
            className={`${styles.btn} cancel`}
            onClick={() => exitHandler()}
          />
          <Button
            cKBtn={true}
            btnText={"RESTART"}
            className={`${styles.btn} continue`}
            onClick={() => restartHandler()}
          />
        </div>
      </div>
    </div>
  );
};
