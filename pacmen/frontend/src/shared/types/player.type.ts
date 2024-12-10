import { GhostTypes, Position } from ".";

export enum GameRole {
  PACMAN = "🤗",
  GHOST = "👻",
}

export enum PlayerState {
  ALIVE,
  DEAD,
  SCARE,
  POWER,
}

export interface Player {
  id: number;
  ready:boolean;
  username: string;
  type:GhostTypes
  role: GameRole;
  color?: string;
  start: Position;
  state: PlayerState;
  position: Position;
  direction: Direction;
}

export enum Direction {
  UP = "up",
  DOWN = "down",
  RIGHT = "right",
  LEFT = "left",
}
