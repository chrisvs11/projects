import { CSSProperties, FC } from "react";

import styles from "./tile.module.css";

interface TileProps {
  backgroundImage?: string;
  height?: string;
  rotation?:number
}

export const Tile: FC<TileProps> = ({ backgroundImage, height, rotation=0 }) => {
  
  const style: CSSProperties = { backgroundImage: `url(${backgroundImage})`, height:`${height}`,width:`${height}`, transform:`rotate(${rotation/360}turn)`};

  return <div className={styles.tile} style={style}></div>;
};
