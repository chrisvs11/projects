import { FC, SetStateAction } from "react";

import { GameMap } from "@/shared/types";

import styles from "./map-select-container.module.css";

import { Button, MapLayout } from "..";
interface MapSelectContainerProps {
  currentMap: GameMap;
  setMapIndex: (value: SetStateAction<number>) => void;
  mapsLength: number;
  mapIndex: number;
  className:string;
  tileWidth:number
}

export const MapSelectContainer: FC<MapSelectContainerProps> = ({
  currentMap,
  setMapIndex,
  mapsLength,
  mapIndex,
  className,
  tileWidth
}) => {
  const getNextMapId = (direction: "increment" | "decrement") => {
    mapIndex = Math.abs(mapIndex + (direction === "increment" ? 1 : -1));
    const finalIndex = mapIndex % mapsLength;
    setMapIndex(finalIndex);
  };

  return (
    <div className={`${styles.map_container} ${className}`}>
      <Button
        cKBtn={false}
        btnText={"<"}
        className={styles.map_btns}
        onClick={() => getNextMapId("decrement")}
        ckVariant="ghost"
      />
      <div className={styles.map_layout}>
        {currentMap ? (
          <MapLayout
            mapTiles={currentMap.tiles}
            tilesHeight={tileWidth}
            cols={currentMap.cols}
            rows={currentMap.rows}
          />
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
