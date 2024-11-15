import { useState } from "react";

import { CellType, Coordinates, Direction, GameMap, Member, Player } from "../types";

import { useRecoilState } from "recoil";

import { PlayerIdState } from "../states";
import { useUsername } from "./username.hook";

export const usePlayer = () => {
  const [direction, setDirection] = useState<Direction>();
  const [playerId,setPlayerId] = useRecoilState(PlayerIdState)
  const {username} = useUsername()
  const [player,setPlayer] = useState<Player|null>(null)

  const getNextCoordinates = (
    current: Coordinates,
    gameMap: GameMap
  ): Coordinates => {
    if (!direction) return current;

    const { row, col } = current;

    const moveHash: { [key: string]: Coordinates } = {
      [Direction.RIGHT]: { row, col: col + 1 },
      [Direction.LEFT]: { row, col: col - 1 },
      [Direction.UP]: { row: row - 1, col },
      [Direction.DOWN]: { row: row + 1, col },
    };

    const nextCoordinates: Coordinates = moveHash[direction];

    const index = gameMap.cols * nextCoordinates.row + nextCoordinates.col;

    if (isRightEdge(current, gameMap.cols) && direction === Direction.RIGHT) {
      console.log("Right Edge Move");
      return { row: row, col: 0 };
    }

    if (isLeftEdge(current) && direction === Direction.LEFT) {
      console.log("Left Edge move");
      return { row, col: gameMap.cols - 1};
    }

    if (gameMap.tiles[index].type === CellType.WALL) return current;

    return nextCoordinates;
  };

  const isRightEdge = (current: Coordinates, cols: number) => {
    return current.col === cols-1;
  };

  const isLeftEdge = (current: Coordinates) => {
    return current.col === 0;
  };

  const  setId = (members:Member[]) => {
    const playerIndex = members.findIndex(member => member.username === username)
    if(playerIndex < 0 ) return 
    console.log(`setting player ${username} to id ${playerIndex+1}`)
    setPlayerId(String(playerIndex+1))
  }

  

  return {
    setDirection,
    direction,
    getNextCoordinates,
    playerId,
    setId,
    player,
    setPlayer
  };
};
