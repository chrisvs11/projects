import { Direction, GameMap, Player } from 'src/shared/types';

export class Game {
  uuid?: string;
  startAt?: Date;
  endAt?: Date;
  createdAt: Date;
  players: Player[];
  map: GameMap;
  playtime: number;
  lives:number
  pacmanScore:number;
  ghostScore:number;
  numOfPellets:number
  gameMoveQueue?:GameMoveQueue
}


export interface GameMoveQueue {[key:string]:Direction}
