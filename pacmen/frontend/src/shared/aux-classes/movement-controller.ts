import { CellType, Direction, GameMap, MapTile, Position } from "../types";
import { MapHandler } from "./map-handler";

export class MovementHandler {
  private directionToPosition(
    direction: Direction,
    currentPosition: Position
  ): Position {
    const { col, row } = currentPosition;

    const directionToCoordinatesMap: { [key: string]: Position } = {
      [Direction.RIGHT]: { row, col: col + 1 },
      [Direction.LEFT]: { row, col: col - 1 },
      [Direction.UP]: { row: row - 1, col },
      [Direction.DOWN]: { row: row + 1, col },
    };

    return directionToCoordinatesMap[direction];
  }

  private PositionToIndex(coordinates: Position, cols: number) {
    return cols * coordinates.row + coordinates.col;
  }

  public getNextPosition(
    currentPosition: Position,
    gameMap: GameMap,
    direction: Direction|null
  ): Position | null {
    const { col } = currentPosition;
    const { cols } = gameMap;

    if(!direction) return null

    if (this.isRightEdge(col, cols) || this.isLeftEdge(col)) {
      return this.getSpecialCoordinate(
        currentPosition,
        gameMap.cols,
        direction
      );
    }

    const nextPosition: Position = this.directionToPosition(
      direction,
      currentPosition
    );
    const mapIndex: number = this.PositionToIndex(nextPosition, gameMap.cols);
    const nextTile: MapTile = MapHandler.getMapTile(gameMap, mapIndex);
    
    if (nextTile.type === CellType.WALL) return null;

    return nextPosition;
  }

  private getSpecialCoordinate(
    position: Position,
    cols: number,
    direction: Direction
  ): Position {
    const { row, col } = position;

    if (this.isRightEdge(col, cols) && direction === Direction.RIGHT) {
      console.log("Right Edge Move");
      return { row: row, col: 0 };
    } else {
      return { row, col: cols - 1 };
    }
  }

  private isRightEdge(col: number, cols: number) {
    return col === cols - 1;
  }

  private isLeftEdge(col: number) {
    return col === 0;
  }
}
