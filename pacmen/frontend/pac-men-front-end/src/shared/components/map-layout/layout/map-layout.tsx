import { CSSProperties, FC } from "react";

import  Tile  from "../tile/tile";

import { getCellBackground } from "../map-builder";

import { MapLayoutProps } from "@/shared/types";

export const MapLayout: FC<MapLayoutProps> = ({ mapTiles, tilesHeight, rows,cols }) => {
  
  const mapSize: CSSProperties = {
    display: "grid",
    gridTemplateRows: `repeat(${rows},1fr)`,
    gridTemplateColumns: `repeat(${cols},1fr`,
  };
  return (
    <div className="map_layout" style={mapSize}>
      {mapTiles.map((tile, index) => {
        const { path, rotation } = getCellBackground(tile);
        return (
          <Tile
            row={tile.row}
            col={tile.col}
            key={index}
            height={tilesHeight}
            backgroundImage={path}
            rotation={rotation}
          />
        );
      })}
    </div>
  );
};
