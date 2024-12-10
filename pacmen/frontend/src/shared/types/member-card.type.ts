import { GhostTypes } from "./ghost.type";

export interface MemberCardProps {
    username: string;
    playerNumber: number;
    ghostType?:GhostTypes
    isHost: boolean;
    hostUsername: string;
    lobbyId:string;
  }
  