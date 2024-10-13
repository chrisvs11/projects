import { Direction, LobbyType } from ".";

export interface GameCreateOptions {
  lobbyId: string;
}

export interface GameMoveCreateOptions {
  playerNumber: number;
  gameId: string;
  direction: Direction;
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
