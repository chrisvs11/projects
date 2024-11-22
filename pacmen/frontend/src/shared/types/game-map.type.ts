import { MapTile } from ".";

export interface GameMap {
  id: string;
  name: string;
  rows: number;
  cols: number;
  tiles: MapTile[];
  maxPlayers: number;
}

export enum CellType {
  PACMAN_INIT = 'PH',
  GHOST_INIT = 'GH',
  WALL = 'W',
  PATH = '*',
}

export enum GameItem {
  CHERRY = '🍒',
  POWER_UP = '🔋',
  PELLET = '🟡',
  EMPTY = 'ㅤ',
}
