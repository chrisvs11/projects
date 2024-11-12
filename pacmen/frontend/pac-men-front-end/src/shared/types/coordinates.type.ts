export interface Coordinates {
  row: number;
  col: number;
}

export interface RecCoordinates {
  top: number;
  left: number;
}

export interface GameCoordinates {
  [key: string]: Coordinates;
}

export interface GameRecCoordinates {
  [key: string]: RecCoordinates;
}
