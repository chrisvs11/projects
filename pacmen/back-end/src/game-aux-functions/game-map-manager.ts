import { MapRenderer } from './map-renderer';

import { GameMap, MapCell, Movement, Player } from 'src/shared/types';

export class GameMapManager {
  private gameMap: GameMap;

  constructor(private mapRenderer: MapRenderer) {}

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

  addPlayersMovementToMap(pacmanNextMovement: Movement, ghostsNextMovement: Movement[]): void {

    console.log('Update Map with Players Movements: Started');
    const playerMovement:Movement[] = [pacmanNextMovement, ...ghostsNextMovement];
    let mapCell = this.gameMap.cells

    playerMovement.forEach((movement,index) => {
      const { current, next } = movement.coordinates;
      mapCell = this.updateMapCell(next, current, mapCell, index+1);
    });

    console.log('Update Map with Players Movements: Completed');
    this.gameMap.cells = mapCell
    
  }


  printMapLayout(players:Player[]): void {
    console.log('Rendering Map....');
    this.mapRenderer.printMapLayout(this.gameMap, players);
  }
}
