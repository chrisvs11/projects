import { FC } from "react";

import { Button, GhostsWinSlider, PacmanWinSlider, TieSlider } from "..";

import styles from "./game-over-card.module.css";
import { myAudioProvider, SessionStorage } from "@/shared/aux-classes";
import { useCustomQuery } from "@/shared/hooks";
import { useRouter } from "next/navigation";

interface GameOverCard {
  lives: number;
  pacmanScore: number;
  ghostScore: number;
}

export const GameOverCard: FC<GameOverCard> = ({
  lives,
  pacmanScore,
  ghostScore,
}) => {
  const { leaveLobby } = useCustomQuery();
  const router = useRouter();

  const exitHandler = async () => {
    const lobbyId: string = SessionStorage.getValue("lobbyId");
    const username: string = SessionStorage.getValue("username");
    if (!username || !lobbyId) return;
    try {
      await leaveLobby({
        username,
        lobbyId,
      });
      SessionStorage.eliminateValue("lobbyId")
      SessionStorage.eliminateValue("gameId")
      myAudioProvider.stopAllMusic();
      router.push("/");
    } catch (e) {
      console.error("Error exiting...");
    }
  };

  const restartHandler = () => {
    try {
        const lobbyId: string = SessionStorage.getValue("lobbyId");
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
