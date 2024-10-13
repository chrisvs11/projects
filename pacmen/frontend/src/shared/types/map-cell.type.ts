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

export interface MapCell {
  row: number;
  col: number;
  playersId?: number[];
  item?: GameItem;
  type: CellType;
  wallType?:string
  rotation?: number
}

