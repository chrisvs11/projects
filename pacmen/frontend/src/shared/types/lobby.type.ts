import { GhostTypes } from "./ghost.type";

export interface Lobby {
  code: string;
  deletedAt?: Date;
  lobbyReady:boolean;
  hostUsername: string;
  gameStarted:boolean;
  startTime?:number;
  gameId?: string;
  id: string;
  uuid:string
  maxPlayers: number;
  mapId: string;
  members: Member[];
  playtime: number;
  type: LobbyType;

}

export enum LobbyType {
  PRIVATE = 'private',
  PUBLIC = 'public',
  LOCAL = 'local',
}

export interface Member {
    username:string,
    type:GhostTypes,
    ready:boolean,
}