import { MapCell } from "./map-cell.type";

export default interface GameMap {
  id?: string;
  name: string;
  rows: number;
  cols: number;
  cells: MapCell[];
  maxPlayers: number;
  minPlayers: number;
}

export enum CellType {
  PACMAN_INIT = 'P',
  GHOST_INIT = 'G',
  WALL = 'W',
  PATH = '*',
}

export enum GameItem {
  CHERRY = '🍒',
  POWER_UP = '🔋',
  PELLET = '🟡',
  EMPTY = 'ㅤ',
}
