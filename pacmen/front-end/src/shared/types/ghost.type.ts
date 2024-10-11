import { Direction, PlayerState } from "./player.type";

export enum GhostTypes {
  BLINKY = "blinky",
  PINKY = "pinky",
  INKY = "inky",
  CLYDE = "clyde",
}

export interface GhostProps {
  state: PlayerState;
  type: GhostTypes;
  direction: Direction;
  fps?: number;
  scale: number;
  positionX?:number;
  positionY?:number;
}
