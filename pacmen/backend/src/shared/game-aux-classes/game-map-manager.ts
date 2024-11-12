import { GameMap, MapCell, Player} from 'src/shared/types';

import { printMapLayout } from '../game-aux-functions';

export class GameMapManager {
  private gameMap: GameMap;

  constructor() {}

  setGameMap(gameMap: GameMap):void {
    this.gameMap = gameMap;
  }

  getGameMap(): GameMap {
    return this.gameMap;
  }

  clearCell(coordinate:number) {
    this.gameMap.cells[coordinate].playerIds = []
  }

  private updateMapCell(
    nextCoordinate: number,
    currentCoordinates: number,
    mapCells: MapCell[],
    playerUuid: number,
  ): MapCell[] {
    if(nextCoordinate) {
      mapCells[nextCoordinate].playerIds.push(playerUuid);
      mapCells[currentCoordinates].playerIds = mapCells[
        currentCoordinates
      ].playerIds.filter((id) => id !== playerUuid);
    }  
    return mapCells
  }

  updateMap(...players:Player[]): void {
    let mapCell = this.gameMap.cells
    players.forEach((player) => {
      const { current, next } =player.movement.coordinates;
      mapCell = this.updateMapCell(next, current, mapCell,player.id);
      console.log(`player ${player.username}`, this.gameMap.cells[current])
    }); 
   
  }

  updateCell(
    row: number,
    col: number,
    data: MapCell,
  ) {
    const updatedMap = this.gameMap.cells.map((cell) => {
      if (cell.col === col && cell.row === row) {
        cell = data;
        return cell;
      } else {
        return cell;
      }
    });
  
    this.gameMap.cells = updatedMap
  }
  

  printMapLayout(players:Player[]): void {
    console.log('Rendering Map....');
    printMapLayout(this.gameMap, players);
  }
}
