export enum GameRole {
  PACMAN = '🤗',
  GHOST = '👻',

}

export enum PlayerState {
  ALIVE,
  PACMAN_DEAD,
  PACMAN_POWER,
  GHOST_DEAD,
  GHOST_SCARE,
}


export interface Player {
  uuid?: number;
  username: string;
  role: GameRole;
  state: PlayerState;
  movement: Movement;
  createdAt: Date;
  deletedAt?: Date;
}

export interface Movement {
  direction: Direction;
  coordinates: PlayerCoordinates;
}
export interface PlayerCoordinates {
  current: number | null;
  next: number | null;
  start: number;
}

export enum Direction {
  UP = "up",
  DOWN = "down",
  RIGHT = "right",
  LEFT = "left",
}
