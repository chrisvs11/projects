import { Lobby } from "@/shared/types";
import { FC } from "react";
import { Button } from "../../buttons";
import { SessionStorage } from "@/shared/aux-classes";
import { useRouter } from "next/navigation";
import styles from "./lobby_row.module.css"

interface lobbyRowProps {
  className: string;
  lobby: Lobby;
}

const playerImage: string =
  "https://seeklogo.com/images/P/pacman-ghost-logo-4E0E79293D-seeklogo.com.png";

export const LobbyRow: FC<lobbyRowProps> = ({ className, lobby }) => {
  const router = useRouter();

  const clickHandler = (lobbyId: string) => {
    SessionStorage.setValue("lobbyId", lobbyId);
    router.push("/username");
  };

  return (
    <div className={`${className} ${styles.lobby_card}`}>
      <p>{lobby.code}</p>
      <div className={styles.members_container}>
        <img src={playerImage} alt="" className={styles.image} />
        {`${lobby.members.length}/${lobby.maxPlayers}`}
      </div>
      <div className="button_container">
        <Button
          cKBtn
          btnText="Join"
          className={styles.btn}
          onClick={() => clickHandler(lobby.id)}
        />
      </div>
    </div>
  );
};
