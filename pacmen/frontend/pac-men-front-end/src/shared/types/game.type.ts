import { Player } from ".";
export interface Game {
  id: string;
  lobbyId:string;
  players: Player[];
  playtime: number;
  lives: number;
  pacmanScore: number;
  pacmanId:number;
  ghostScore: number;
  numOfPellets: number;
  powerUpState:boolean;
  gameState:GameState;
}

export enum GameState {
  START = "start",
  ON_GOING ="onGoing",
  WAITING ="waiting",
  END = "end",
  RESTART = "restart"
}
