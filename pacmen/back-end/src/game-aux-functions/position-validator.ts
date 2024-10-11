import { CellType, Direction, GameMap, Movement } from 'src/shared/types';

export class PositionValidator {
  constructor() {}

  getDeltaIndex(cols: number, direction: string) {
    const deltaIndex = {
      up: -cols,
      down: cols,
      left: -1,
      right: 1,
    };

    return deltaIndex[direction];
  }

  validateMovement(map: GameMap, movement: Movement): Movement {
    const currentMovement: Movement = { ...movement };
    const { direction } = movement;
    const { current: currentIndex } = movement.coordinates;
    const currentCell = map.cells[currentIndex];

    const deltaIndex = this.getDeltaIndex(map.cols, direction);
    const nextIndex = currentIndex + deltaIndex;
    const nextCell = map.cells[nextIndex];

    if (nextCell?.type !== CellType.WALL) {
      currentMovement.coordinates.next = nextIndex;
      return currentMovement;
    }

    const specialDelta: number = map.cols - 1;
    const isOnLeftEdge: boolean = this.isOnLeftEdge(currentCell.col);
    const isOnRightEdge: boolean = this.isOnRightEdge(
      currentCell.col,
      map.cols,
    );
    const specialIndex =
      isOnLeftEdge && direction === Direction.LEFT
        ? currentIndex + specialDelta
        : isOnRightEdge && direction === Direction.RIGHT
          ? currentIndex - specialDelta
          : null;

    if (specialIndex) {
      currentMovement.coordinates.next = specialIndex;
      return currentMovement;
    }

    currentMovement.coordinates.next = null;

    return currentMovement;
  }

  isOnLeftEdge(col: number): boolean {
    return col === 0;
  }

  isOnRightEdge(col: number, cols: number): boolean {
    return col === cols - 1;
  }
}
