"use client";
import { CSSProperties, FC} from "react";

import Tile from "../tile/tile";

import { getCellBackground } from "../map-builder";

import { MapLayoutProps } from "@/shared/types";

export const MapLayout: FC<MapLayoutProps> = ({
  tilesHeight,
  gameMap

}) => {

  const mapSize: CSSProperties = {
    display: "grid",
    gridTemplateRows: `repeat(${gameMap?.rows},1fr)`,
    gridTemplateColumns: `repeat(${gameMap?.cols},1fr`,
  };
  return (
    <div className="map_layout" style={mapSize}>
      {gameMap && gameMap.tiles.map((tile, index) => {
        const { path, rotation } = getCellBackground(tile);
        return (
          <div key={index}>
            <Tile
              row={tile.row}
              col={tile.col}
              key={index}
              height={tilesHeight}
              backgroundImage={path}
              rotation={rotation}
              type={tile.type}
            />
          </div>
        );
      })}
    </div>
  );
};
