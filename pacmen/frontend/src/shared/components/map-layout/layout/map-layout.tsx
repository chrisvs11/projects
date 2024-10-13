import { CSSProperties, FC, MutableRefObject } from "react";

import GameMap from "@/shared/types/game-map.type";

import { Tile } from "../tile/tile";

import { getCellBackground } from "../map-builder";

interface MapProps {
  gameMap: GameMap;
  tilesHeight?: number;
  
}

export const MapLayout: FC<MapProps> = ({ gameMap, tilesHeight}) => {
  const numRows = gameMap.rows;
  const numCols = gameMap.cols;

  const mapSize: CSSProperties = {
    display: "grid",
    gridTemplateRows: `repeat(${numRows},1fr)`,
    gridTemplateColumns: `repeat(${numCols},1fr`,
  };

  return (
    <div className="map_layout" style={mapSize}>
      {gameMap.cells.map((cell, index) => {
        const { path, rotation } = getCellBackground(cell);
        return (
          <Tile
            key={index}
            height={`${tilesHeight}px`}
            backgroundImage={path}
            rotation={rotation}
          />
        );
      })}
    </div>
  );
};
