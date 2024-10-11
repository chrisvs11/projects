import { FC, SetStateAction } from "react";

import { Button } from "../button";

import GameMap from "@/shared/types/game-map.type";

import { MapLayout } from "@/shared";

import styles from "./map-select-container.module.css";
interface MapSelectContainerProps {
  currentMap: GameMap;
  setMapIndex: (value: SetStateAction<number>) => void;
  mapsLength:number
  mapIndex:number
}

export const MapSelectContainer: FC<MapSelectContainerProps> = ({
  currentMap,
  setMapIndex,
  mapsLength,
  mapIndex

}) => {
  const getNextMapId = (direction: "increment" | "decrement") => {
    
    mapIndex = Math.abs(
      mapIndex + (direction === "increment" ? 1 : -1)
    );

    const finalIndex = mapIndex % mapsLength;

    setMapIndex(finalIndex);
  };

  return (
    <div className={styles.map_container}>
      <Button
        cKBtn={false}
        btnText={"<"}
        className={styles.map_btns}
        onClick={() => getNextMapId("decrement")}
        ckVariant="ghost"
      />
      <div className={styles.map_layout}>
        <div className={styles.map_title}>{currentMap?.name}</div>
        {currentMap ? (
          <MapLayout gameMap={currentMap} tilesHeight={10} />
        ) : (
          "undefined"
        )}
      </div>
      <Button
        cKBtn={false}
        btnText={">"}
        className={styles.map_btns}
        onClick={() => getNextMapId("increment")}
        ckVariant="ghost"
      />
    </div>
  );
};
