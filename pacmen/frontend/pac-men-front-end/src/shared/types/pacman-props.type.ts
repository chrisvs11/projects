import { PlayerState } from "./player.type";

export interface PacmanProps {
    state: PlayerState;
    rotation?:number
    velocity?:number
    scale?:number 
  }