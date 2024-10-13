import { Direction } from './direction.type';

import { MapCell } from './map-cell.type';

export enum GameRole {
  PACMAN = '🤗',
  GHOST = '👻',
}

export enum PlayerState {
  ALIVE="0",
  PACMAN_DEAD = '😖',
  PACMAN_POWER = '😋',
  GHOST_DEAD = '👀',
  GHOST_SCARE = '🏃',
}

export class Player {
  id?: number;
  username?: string;
  role: GameRole;
  state: PlayerState;
  color?: string;
  movement: Movement;
  createdAt: Date;
  deletedAt?: Date;
  difficulty?: Difficulty;
  targetCell?: MapCell;
}

type Difficulty = 'hard' | 'medium' | 'easy';

export interface Movement {
  direction: Direction | null;
  coordinates: PlayerCoordinates;
}
export interface PlayerCoordinates {
  current: number | null;
  next: number | null;
  start: number;
  prev:number | null
}
