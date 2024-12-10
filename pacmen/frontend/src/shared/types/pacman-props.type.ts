import { Direction, PlayerState } from "./player.type";

export interface PacmanProps {
    state: PlayerState;
    direction?:Direction;
    velocity?:number
    scale?:number 
  }