import { Injectable } from '@nestjs/common';

import {
  Wall,
  CherryCell,
  GameMap,
  GhostBase,
  MapCell,
  PacmanBase,
  Path,
  PowerUpCell,
  Collection,
  EmptyCell,
} from '../../shared/types';

import { FirebaseService } from '../../shared/services';

@Injectable()
export class MapService {
  private cells: MapCell[];
  private rows: number;
  private cols: number;
  private name: string;
  private maxPlayers: number;
  private minPlayers: number;

  constructor(private firebaseService: FirebaseService) {
    this.cells = [];
    this.rows = 0;
    this.cols = 0;
    this.name = 'nameless';
    this.minPlayers = 1;
    this.maxPlayers = 4;
  }

  generateMap(mapSchema: string[][]): MapService {
    this.rows = mapSchema.length;
    this.cols = mapSchema[0].length;

    mapSchema.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        switch (cell) {
          case "  ":
            const emptyCell = new EmptyCell(rowIndex, colIndex).toPlainObject();
            this.cells.push(emptyCell);
            break;
          case 'PH':
            const pacmanCell = new PacmanBase(
              rowIndex,
              colIndex,
            ).toPlainObject();
            this.cells.push(pacmanCell);
            break;
          case 'PU':
            const powerUpCell = new PowerUpCell(
              rowIndex,
              colIndex,
            ).toPlainObject();
            this.cells.push(powerUpCell);
            break;
          case 'C':
            const cherryCell = new CherryCell(
              rowIndex,
              colIndex,
            ).toPlainObject();
            this.cells.push(cherryCell);
            break;
          case 'GH':
            const ghostCell = new GhostBase(rowIndex, colIndex).toPlainObject();
            this.cells.push(ghostCell);
            break;
          case '**':
            const pathCell = new Path(rowIndex, colIndex).toPlainObject();
            this.cells.push(pathCell);
            break;
          default:
            const wallCell = new Wall(rowIndex, colIndex, cell).toPlainObject();
            this.cells.push(wallCell);
        }
      });
    });
    return this;
  }

  setName(name: string): MapService {
    this.name = name;
    return this;
  }

  setMaxMinPlayers(minPlayers: number, maxPlayers: number): MapService {
    (this.minPlayers = minPlayers), (this.maxPlayers = maxPlayers);

    return this;
  }

  createMap(): GameMap {
    const map: GameMap = {
      name: this.name,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      maxPlayers: this.maxPlayers,
      minPlayers: this.minPlayers,
    };

    return map;
  }

  async saveMapInFirebase(map: string[][]) {
    this.generateMap(map);
    this.setMaxMinPlayers(4, 6);
    this.setName('map1');
    const gameMap = this.createMap();
    console.log(gameMap)
    return this.firebaseService.createEntity(Collection.MAPS, gameMap);
  }
}
