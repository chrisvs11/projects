export interface Position {
  row: number;
  col: number;
}

export interface RecCoordinates {
  top: number;
  left: number;
}

export interface GameCoordinates {
  [key: string]: Position;
}

export interface GameRecCoordinates {
  [key: string]: RecCoordinates;
}
