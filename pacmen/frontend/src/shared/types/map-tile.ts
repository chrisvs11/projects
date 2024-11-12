import { CellType, GameItem } from "./game-map.type";

export interface MapTile {
  row: number;
  col: number;
  playersId?: number[];
  item?: GameItem;
  type: CellType;
  wallType?:string
  rotation?: number
}

