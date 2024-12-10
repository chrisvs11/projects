"use client";
import {
  Position,
  GameItem,
  GameMap,
  RecCoordinates,
  CollectionName,
  CellType,
} from "../types";

import { useRecoilState } from "recoil";

import { firebaseService } from "../services";

import { gameMapState, PelletsState } from "../states";
import { myAudioProvider } from "../aux-classes";

export const useGameMap = () => {

  const [gameMap, setGameMap] = useRecoilState<GameMap>(gameMapState)
  const [numPellets, setNumPellets] = useRecoilState<number>(PelletsState)

  const updateNumPellets = () => {   
    setNumPellets(prev => prev-1)
  }

  async function fetchMap(mapId: string){
      const fetchMap = await firebaseService.getData<GameMap>(
        CollectionName.MAPS,
        mapId
      );

      if (!fetchMap) throw new Error("ERROR GETTING THE MAP...");
      
      setGameMap(fetchMap);

      setNumPellets(fetchMap.tiles.reduce((numPellets,tile) => {
        return tile.type === CellType.PATH ? numPellets +1 : numPellets},0))
 
      return fetchMap;
  }

  const getMapTileItem = (position: Position, gameMap:GameMap): GameItem => {
    if (!gameMap) return GameItem.EMPTY;
    const { row, col } = position;
    const index: number = gameMap.cols * row + col;
    const item: GameItem | undefined = gameMap.tiles[index].item;

    if (item === GameItem.EMPTY) return GameItem.EMPTY;

    if(item === GameItem.PELLET) {
      updateNumPellets()
      myAudioProvider.playEatPelletSound()
    }

    const newTiles = [...gameMap.tiles]

    newTiles[index] = {...newTiles[index],item:GameItem.EMPTY}

    const newGameMap = {...gameMap,tiles:newTiles}

    setGameMap(newGameMap);

    return item || GameItem.EMPTY;
  };

  const getRecCoordinates = (
    position: Position,
    tileWidth: number
  ): RecCoordinates => {
    const id = `${position.row}-${position.col}`;
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
    fetchMap,
    setGameMap,
    getMapTileItem,
    getRecCoordinates,
    numPellets
  };
};
