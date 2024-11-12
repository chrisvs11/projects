import { Direction, PlayerState } from "./player.type";

export enum GhostTypes {
  BLINKY = "blinky",
  PINKY = "pinky",
  INKY = "inky",
  CLYDE = "clyde",
  STINKY = "stinky",
  PURPKY = "purpky"
}

export const hashGhostType:{[key in string]:GhostTypes} = {
  "blinky":GhostTypes.BLINKY,
  "pinky":GhostTypes.PINKY,
  "inky":GhostTypes.INKY,
  "clyde":GhostTypes.CLYDE,
  "stinky":GhostTypes.STINKY,
  "purpky":GhostTypes.PURPKY
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
