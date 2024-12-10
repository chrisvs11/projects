import {  Direction, GameRole, PlayerState, Position } from ".";
export interface AvatarProps {
  offsetX: number;
  offsetY: number;
  tileWidth:number;
  position: Position;
  playerNum: number;
  ghostType:string;
  role: GameRole;
  state: PlayerState;
  direction?: Direction;
  scale?: number;
  className:string
}
