import { GameRole } from ".";

export interface GameStatsProps {
    lives: number;
    playtime: number;
    playerId: string;
    role: GameRole;
    numPellets:number;
  }