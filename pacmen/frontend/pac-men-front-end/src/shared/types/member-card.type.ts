import { GhostTypes } from "./ghost.type";

export interface MemberCardProps {
    username: string;
    position: number;
    ghostType?:GhostTypes
    isHost: boolean;
    hostUsername: string;
    lobbyId:string;
  }
  