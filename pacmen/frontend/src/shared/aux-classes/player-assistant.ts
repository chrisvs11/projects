import {
  CellType,
  Direction,
  GameMap,
  GameState,
  Player,
  PlayerState,
  Position,
} from "../types";

const OPPOSITE_DIRECTION_HASH: { [key in Direction]: Direction } = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
};
export class PlayerAssistant {
  private directionQueue: Direction[] = [];

  constructor() {}

  addNewDirection = (
    direction: Direction,
  ) => {

    const inputDirection = direction;



    if (this.directionQueue.length > 1) {
      this.directionQueue[1] = inputDirection;
      return;
    }

    this.directionQueue.push(inputDirection);

    console.log(this.directionQueue);
  };

  generateRandomDirection = (): Direction => {
    const dirArray: Direction[] = Object.values(Direction);
    const randomDirIndex = Math.floor(Math.random() * dirArray.length);

    return dirArray[randomDirIndex];
  };

  changeDefaultDirection = (direction: Direction) => {
    this.directionQueue = [direction];
  };

  getDirection = (index: number): Direction | null => {
    return this.directionQueue[index] || null;
  };

  getPlayerNextPosition = (
    gameState: GameState,
    currentPlayerState: Player,
    gameMap: GameMap
  ): Position => {
    const { position } = currentPlayerState;

    if (gameState === GameState.END) return currentPlayerState.position;

    if (gameState === GameState.RESTART) return currentPlayerState.start;

    if (this.directionQueue.length === 0) return currentPlayerState.position;

    if (currentPlayerState.state === PlayerState.SCARE) {
      const direction = this.getRandomDir(
        position,
        gameMap,
        this.directionQueue[0]
      );
      const scarePosition = this.getPosition(position, gameMap, direction);
      this.changeDefaultDirection(direction);
      return scarePosition || currentPlayerState.position;
    }

    const defaultNextPosition: Position | null = this.getPosition(
      position,
      gameMap,
      this.directionQueue[0]
    );
    const newNextPosition: Position | null = this.getPosition(
      position,
      gameMap,
      this.directionQueue[1]
    );

    if (newNextPosition) this.changeDefaultDirection(this.directionQueue[1]);

    return (
      newNextPosition || defaultNextPosition || currentPlayerState.position
    );
  };

  getRandomDir = (
    currentPosition: Position,
    gameMap: GameMap,
    currentDir: Direction
  ): Direction => {
    const forbiddenDirection: Direction = OPPOSITE_DIRECTION_HASH[currentDir];
    const allDirections = [
      Direction.UP,
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT,
    ];
    const validDirections = allDirections.filter((dir) => {
      return (
        dir !== forbiddenDirection &&
        this.getPosition(currentPosition, gameMap, dir)
      );
    });
    const randomIndex = Math.floor(Math.random() * validDirections.length);
    return validDirections[randomIndex] || currentDir;
  };

  getPosition = (
    current: Position,
    gameMap: GameMap,
    direction: Direction
  ): Position | null => {
    const { row, col } = current;

    if (!direction) return null;

    const directionToPositionAdapter: { [key: string]: Position } = {
      [Direction.RIGHT]: { row, col: col + 1 },
      [Direction.LEFT]: { row, col: col - 1 },
      [Direction.UP]: { row: row - 1, col },
      [Direction.DOWN]: { row: row + 1, col },
    };

    if (this.isSpecialMove(current, gameMap.cols, direction)) {
      console.log("Special Move");
      return this.getSpecialMove(current, gameMap.cols, direction);
    }
    const nextPosition: Position = directionToPositionAdapter[direction];
    const nextIndex: number =
      gameMap.cols * nextPosition.row + nextPosition.col;

    if (gameMap.tiles[nextIndex].type !== CellType.WALL) return nextPosition;

    return null;
  };

  isSpecialMove = (current: Position, cols: number, direction: Direction) => {
    return (
      (this.isRightEdge(current, cols) && direction === Direction.RIGHT) ||
      (this.isLeftEdge(current) && direction === Direction.LEFT)
    );
  };

  getSpecialMove = (
    current: Position,
    cols: number,
    direction: Direction
  ): Position | null => {
    const { row } = current;

    if (this.isRightEdge(current, cols) && direction === Direction.RIGHT) {
      console.log("Right Edge Move");
      return { row: row, col: 0 };
    }

    if (this.isLeftEdge(current) && direction === Direction.LEFT) {
      console.log("Left Edge move");
      return { row, col: cols - 1 };
    }

    return null;
  };

  isRightEdge = (current: Position, cols: number) => {
    return current.col === cols - 1;
  };

  isLeftEdge = (current: Position) => {
    return current.col === 0;
  };
}
