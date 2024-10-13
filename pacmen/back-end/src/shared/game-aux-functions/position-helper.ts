import { CellType, Direction, GameMap, MapCell} from 'src/shared/types';

export function getDeltaIndex(cols: number, direction: string) {
    const deltaIndex = {
      up: -cols,
      down: cols,
      left: -1,
      right: 1,
    };

    return deltaIndex[direction];
  }

  export function leftEdgeCheck(col: number): boolean {
    return col === 0;
  }

  export function rightEdgeCheck(col: number, cols: number): boolean {
    return col === cols - 1;
  }

  export function getNextValidPosition(map: GameMap,currentPosition:number,currentDirection:Direction): number|null {

    // const currentMovement: Movement = { ...movement };
    const currentCell = map.cells[currentPosition];
    const deltaIndex = getDeltaIndex(map.cols, currentDirection);
    const nextIndex = currentPosition + deltaIndex;
    const nextCell = map.cells[nextIndex];

    if (nextCell?.type !== CellType.WALL) {
      return nextIndex;
    }

    const specialDelta: number = map.cols - 1;
    const isOnLeftEdge: boolean = leftEdgeCheck(currentCell.col);
    const isOnRightEdge: boolean = rightEdgeCheck(
      currentCell.col,
      map.cols,
    );
    const specialIndex =
      isOnLeftEdge && currentDirection === Direction.LEFT
        ? currentPosition + specialDelta
        : isOnRightEdge && currentDirection === Direction.RIGHT
          ? currentPosition - specialDelta
          : null;

    if (specialIndex) {
      return specialIndex;
    }

    return null;
  }



  export function positionOffsetCalculator(
    direction:Direction,
    pacmanCell: MapCell,
    Offset: number,
    gameMap:GameMap
  ): number {

    const {rows,cols} = gameMap
    let index: number = cols * pacmanCell.row + pacmanCell.col;
    let areSpacesLeftEnough: boolean;
    
    if(!direction) return index

    switch (direction) {
      case Direction.UP:
        index = index - Offset * cols;
        areSpacesLeftEnough = pacmanCell.row >= Offset;
        if (!areSpacesLeftEnough) {
          index = pacmanCell.col;
        }
        break;
      case Direction.DOWN:
        index = index + Offset * cols;
        areSpacesLeftEnough = pacmanCell.row <= cols - Offset;
        if (!areSpacesLeftEnough) {
          index = (rows - 1) * cols + pacmanCell.col;
        }
        break;
      case Direction.RIGHT:
        index = index + Offset;
        areSpacesLeftEnough = pacmanCell.col <= cols - Offset;
        if (!areSpacesLeftEnough) {
          index = pacmanCell.row * cols + cols;
        }
        break;
      case Direction.LEFT:
        index = index - Offset;
        areSpacesLeftEnough = pacmanCell.col >= Offset;
        if (!areSpacesLeftEnough) {
          index = pacmanCell.row * cols;
        }
        break;
      default:
        console.log('Error getting pinky target cell');
    }
    return index;
  }

  export function getTransposePosition(
    offsetCell: MapCell,
    playerRefCell: MapCell,
    rows: number,
    cols: number,
  ): number {
    const deltaX = playerRefCell.col - offsetCell.col;
    const deltaY = playerRefCell.row - offsetCell.row;
    let transposeRow = offsetCell.row - deltaY;
    let transposeCol = offsetCell.col - deltaX;

    if (transposeRow >= rows) transposeRow = rows - 1;
    if (transposeRow < 0) transposeRow = 0;
    if (transposeCol >= cols) transposeCol = cols - 1;
    if (transposeCol < 0) transposeCol = 0;

    return transposeRow * cols + transposeCol;
  }

