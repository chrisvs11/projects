"use client"
import { CSSProperties, FC } from "react";

import styles from "./tile.module.css";

import { TileProps } from "@/shared/types";

import React from "react";

const Tile: FC<TileProps> = ({ backgroundImage, height, rotation=0, row, col }) => {
  
  const style: CSSProperties = { backgroundImage: `url(${backgroundImage})`, height:`${height}px`,width:`${height}px`, transform:`rotate(${rotation/360}turn)`};

  return <div className={styles.tile} style={style} id={`${row}-${col}`}> </div>;
};

export default React.memo(Tile)
