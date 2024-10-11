import GameMap from "./game-map.type";

import { Player } from "./player.type";

export interface Game {
    uuid?: string;
    players: Player[];
    map: GameMap;
    playtime: number;
    time:number,
    lives:number
    pacmanScore:number;
    ghostScore:number;
    numOfPellets:number
  }