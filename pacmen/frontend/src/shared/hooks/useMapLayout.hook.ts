import {  useState } from "react";

import {
  Coordinates,
  GameItem,
  GameMap,
  MapTile,
  RecCoordinates,
} from "../types";

import { useGameMap } from ".";
import { GameAudios } from "../aux-classes";

export const useMapLayout = () => {
  const gameAudios = new GameAudios()
  const [mapTiles, setMapTiles] = useState<MapTile[] | null>(null);
  const { gameMap, setGameMap } = useGameMap();



  const updateGameMap = (gameMap: GameMap) => {
    setGameMap(gameMap);
  };

  const getMapTileItem = (
    coordinates: Coordinates,
    mapTiles: MapTile[]
  ): GameItem | null => {
    if (!mapTiles || !gameMap) return null;
    const { row, col } = coordinates;
    const index = gameMap.cols * row + col;
    const mapTile: MapTile = mapTiles[index];

    if (mapTile.item === GameItem.EMPTY) return GameItem.EMPTY;

    if(mapTile.item === GameItem.PELLET) {
      gameAudios.eatPelletMusic()
    }

    const updatedMapTile: MapTile = { ...mapTile, item: GameItem.EMPTY };
  

    const updatedMapTiles: MapTile[] = mapTiles.map((tile, i) => {
      return i === index ? updatedMapTile : tile;
    });

    setMapTiles(updatedMapTiles);

    return mapTile.item || null;
  };

  const getRecCoordinatesOfElementById = (
    coordinates: Coordinates,
    tileWidth: number
  ): RecCoordinates => {
    const id = `${coordinates.row}-${coordinates.col}`;
    const element = document.getElementById(id);
    const parentElement = document.getElementById("parent");
    if (element && parentElement) {
      const parentRect = parentElement.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      const left = rect.left + window.scrollX - parentRect.left;
      const top = rect.top + window.scrollY - parentRect.top - tileWidth;
      return { left, top };
    }
    return { left: 0, top: 0 };
  };

  return {
    gameMap,
    updateGameMap,
    mapTiles,
    setMapTiles,
    getMapTileItem,
    getRecCoordinatesOfElementById,
  };
};
