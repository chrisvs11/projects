import { Lobby } from "@/shared/types";
import { FC } from "react";
import { LobbyRow } from "./lobby-row";
import styles from "./lobby-table.module.css";

interface LobbyTableProps {
  availableLobbies: Lobby[];
}

export const LobbyTable: FC<LobbyTableProps> = ({ availableLobbies }) => {
  return (
    <div className={`${styles.card}`}>
      <div className={styles.headers}>
        <p>LOBBY ID</p>
        <p>PLAYERS</p>
        <p>JOIN</p>
      </div>
      {availableLobbies.length > 0 ? (
        availableLobbies.map((lobby, index) => (
          <LobbyRow className="" lobby={lobby} key={index} />
        ))
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "white",
            marginBottom: "30px",
            fontWeight: "600",
          }}
        >
          <p>NOT PUBLIC LOBBIES AVAILABLE</p>
          <p>GO ON AND HOST ONE 🕹️!!</p>
          <div className={styles.pacman}></div>
        </div>
      )}
    </div>
  );
};
