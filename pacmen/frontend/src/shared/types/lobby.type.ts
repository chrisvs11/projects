import { GhostTypes } from "./ghost.type";

export interface Lobby {
  code: string;
  deletedAt?: Date;
  hostUsername: string;
  gameStarted:boolean;
  gameId: string;
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

interface Member {
    username:string,
    type:GhostTypes,
}