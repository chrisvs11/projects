import { FC } from "react";

import { Button } from "..";

import styles from "./game-controller.module.css"

import { Direction, GameControllerProps } from "@/shared/types";


export const GameController:FC<GameControllerProps> = ({onClick}) => {
    return (
        <div className={styles.controller} style={{ color: "white" }}>
        <Button
          cKBtn={true}
          btnText={"↑"}
          className={`${styles.up} ${styles.control}`}
          onClick={() => onClick(Direction.UP)}
        />
        <Button
          cKBtn={true}
          btnText={"←"}
          className={`${styles.left} ${styles.control}`}
          onClick={() => onClick(Direction.LEFT)}
        />
        <Button
          cKBtn={true}
          btnText={"→"}
          className={`${styles.right} ${styles.control}`}
          onClick={() => onClick(Direction.RIGHT)}
        />
        <Button
          cKBtn={true}
          btnText={"↓"}
          className={`${styles.down} ${styles.control}`}
          onClick={() => onClick(Direction.DOWN)}
        />
      </div>
    )
}