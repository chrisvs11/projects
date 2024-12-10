import useNetwork from "@/shared/hooks/useNetwork";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import styles from "./network-signal.module.css";

export const NetworkSignal: FC = () => {
  const { state } = useNetwork();

  return (
    <div  className={`${styles.signal_container}`}>
      <div>{state?.online ? "ONLINE" : "OFFLINE"}</div>
      <div
        className={`${styles.signal} ${
          state?.online ? styles.online : styles.offline
        }`}
      >
        <FontAwesomeIcon icon={faWifi} />
      </div>
    </div>
  );
};
