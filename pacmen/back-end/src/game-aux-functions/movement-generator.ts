import { GameMoveQueue } from 'src/api/game/model';

import {
  AutoModeType,
  Direction,
  GameMap,
  MapCell,
  Movement,
  Player,
  ValidDirection,
} from 'src/shared/types';

import { PositionValidator } from '.';

export class MovementGenerator {
  private positionValidator: PositionValidator;

  constructor() {
    this.positionValidator = new PositionValidator();
  }

  addNextPositionToMovement(map: GameMap, movement: Movement): Movement {
    return this.positionValidator.addNextPositionToMovement(map, movement);
  }

  generateMovement(
    direction: Direction,
    current: number,
    next: number,
    start: number,
  ): Movement {

    return {
      direction,
      coordinates: {
        current,
        next,
        start,
      },
    };
  }
  getPlayerNextMovement(
    gameMap: GameMap,
    player: Player,
    currentGameQueue: GameMoveQueue,
  ): Movement {
    const { movement } = player;
    const { direction } = movement;
    const { current, start } = movement.coordinates;
    const movementInQueue = currentGameQueue[player.uuid];

    const stayPut: Movement = this.generateMovement(
      direction,
      current,
      current,
      start,
    );
    //Case 1: Start of the game
    if (!movementInQueue && !direction) {
      console.log('player has not move yet');
      return stayPut;
    }
    //Case 2: Player send movement direction to queue
    if (movementInQueue) {
      const queueMovement: Movement = this.generateMovement(
        movementInQueue,
        current,
        null,
        start,
      );

      const nextMovement: Movement = this.addNextPositionToMovement(
        gameMap,
        queueMovement,
      );

      if (nextMovement.coordinates.next) {
        return nextMovement;
      }
    }

    //Case 3 player input not valid, continue with default
    if (direction) {
      const defaultMovement: Movement = this.generateMovement(
        direction,
        current,
        null,
        start,
      );
      const nextMovement: Movement = this.addNextPositionToMovement(
        gameMap,
        defaultMovement,
      );
      if (nextMovement.coordinates.next) {
        return nextMovement;
      }
    }

    return stayPut;
  }

  getOppositeDirection(defaultDirection: Direction): Direction {
    switch (defaultDirection) {
      case Direction.UP:
        return Direction.DOWN;
      case Direction.DOWN:
        return Direction.UP;
      case Direction.RIGHT:
        return Direction.LEFT;
      case Direction.LEFT:
        return Direction.RIGHT;
    }
  }

  autoMove(
    player: Player,
    autoMode: AutoModeType,
    target: MapCell,
    map: GameMap,
  ): Movement {
    let directions: Direction[] = [
      Direction.UP,
      Direction.RIGHT,
      Direction.DOWN,
      Direction.LEFT,
    ];

    const { movement } = player;
    const { direction } = player.movement;

    if (direction) {
      const forbiddenDirection = this.getOppositeDirection(direction);
      directions = directions.filter(
        (direction) => direction !== forbiddenDirection,
      );
    }

    const nextMovements: Movement[] = this.getAllNextMovements(
      map,
      movement,
      directions,
    );

    if (autoMode === AutoModeType.SCARE) {
      return this.scareMove(nextMovements);
    }

    if (autoMode === AutoModeType.CHASE) {
      return this.chaseMove(nextMovements, target, map);
    }
  }

  private getAllNextMovements(
    map: GameMap,
    movement: Movement,
    directions: Direction[],
  ): Movement[] {
    const { current, start } = movement.coordinates;
    let movements: Movement[] = [];
    for (let i = 0; i < directions.length; i++) {
      const newMovement = this.generateMovement(
        directions[i],
        current,
        null,
        start,
      );
      const nextMovement = this.addNextPositionToMovement(map, newMovement);
      if (nextMovement.coordinates.next) {
        movements.push(nextMovement);
      }
    }

    return movements;
  }

  scareMove(validMovements: Movement[]): Movement {
    const validDirectionLength: number = validMovements.length;
    const randomIndex = this.getRandomIndex(validDirectionLength);
    return validMovements[randomIndex];
  }

  chaseMove(
    validMovements: Movement[],
    target: MapCell,
    map: GameMap,
  ) {
    const shortestMovement: Movement = this.getDirectionWithLessDistance(
      validMovements,
      target,
      map,
    );

    return shortestMovement;
  }

  getRandomIndex(top: number): number {
    return Math.floor(Math.random() * top);
  }

  private getDirectionWithLessDistance(
    validMovements: Movement[],
    targetCell: MapCell,
    gameMap: GameMap,
  ): Movement {
    let minDistance: number = Infinity;
    let index: number = Infinity;

    validMovements.forEach(({coordinates:{next:nextIndex}}, index) => {
      const originCell = gameMap.cells[nextIndex];
      const distance = this.calculateDistance(originCell, targetCell);
      if (distance < minDistance) {
        minDistance = distance;
        index = index;
      }
    });
    return validMovements[index];
  }

  calculateDistance(mapCell1: MapCell, mapCell2: MapCell): number {
    const x2 = mapCell2.row;
    const y2 = mapCell2.col;

    const x1 = mapCell1.row;
    const y1 = mapCell1.col;

    const x_distance_square: number = Math.pow(x2 - x1, 2);
    const y_distance_square: number = Math.pow(y2 - y1, 2);
    return x_distance_square + y_distance_square;
  }
}
