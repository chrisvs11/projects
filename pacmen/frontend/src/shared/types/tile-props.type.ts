import { CellType } from "./game-map.type";

export interface TileProps {
    backgroundImage?: string;
    height?: number;
    rotation?:number
    row:number,
    col:number
    type:CellType
  }