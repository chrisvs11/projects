import { Coordinates, Direction, LobbyType, PlayerState, } from ".";

export interface GameCreateOptions {
  lobbyId: string;
}

export interface GameMoveUpdateOptions {
  playerNumber: string;
  gameId: string;
  move: {
    next:Coordinates,
    direction:Direction
  };
}

export interface PlayerStateUpdateOptions {
  playerId: string;
  gameId: string;
  state: string;
}

export interface LobbyCreationOptions {
  maxPlayers: number;
  type: LobbyType;
  hostUsername: string;
  mapId: string;
  playtime: number;
  lives: number;
}

export interface LoobyJoinOptions {
  username: string;
  lobbyId: string;
}


export interface GamePowerUpUpdateOptions {
  gameId: string;
  powerUpState: PlayerState;
}

export interface GameScoreUpdateOptions {
  gameId: string;
  points: number;
}

export interface GameStateUpdateOptions {
  gameId: string;
  state: string;
}

export interface LobbyMemberUpdateOptions {
  lobbyId:string,
  userIndex:string,
  ghostType:string,
}

