import GameMap from "./game-map.type";

import { Player } from "./player.type";

export interface Game {
    id?: string;
    players: Player[];
    map: GameMap;
    playtime: number;
    lives:number
    pacmanScore:number;
    ghostScore:number;
    numOfPellets:number
  }