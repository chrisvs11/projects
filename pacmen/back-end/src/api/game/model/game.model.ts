import { Direction, GameMap, Player } from 'src/shared/types';

export class Game {
  id?: string;
  startAt?: Date;
  endAt?: Date;
  createdAt: Date;
  players: Player[];
  pacmanIndex:number
  map: GameMap;
  playtime: number;
  lives:number
  pacmanScore:number;
  ghostScore:number;
  numOfPellets:number
  gameMoveQueue?:GameMoveQueue
}


export interface GameMoveQueue {[key:string]:Direction}
