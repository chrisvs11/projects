import { MapCell } from '.';

export class GameMap {
  uuid?: string;
  name: string;
  rows: number;
  cols: number;
  cells: MapCell[];
  maxPlayers: number;
  minPlayers: number;
}
