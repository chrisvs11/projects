import { GameMoveQueue } from 'src/api/game/model';

import {
  AutoModeType,
  Direction,
  GameMap,
  MapCell,
  Movement,
  Player,
} from 'src/shared/types';

import { getNextValidPosition } from './position-helper';

export function generateMovement(
  direction: Direction,
  current: number,
  next: number,
  start: number,
  prev:number = null
): Movement {
  return {
    direction,
    coordinates: {
      current,
      next,
      start,
      prev,
    },
  };
}
export function getPlayerNextMovement(
  gameMap: GameMap,
  player: Player,
  currentGameQueue: GameMoveQueue,
): Movement {
  const { movement } = player;
  const { direction } = movement;
  const { current, start } = movement.coordinates;
  const movementInQueue = currentGameQueue[player.id];

  const stayPut: Movement = generateMovement(
    direction,
    current,
    current,
    start,
  );

  if (!movementInQueue && !direction) {
    console.log('player has not move yet');
    return stayPut;
  }
  if (movementInQueue) {
    const nextPosition: number | null = getNextValidPosition(
      gameMap,
      current,
      movementInQueue,
    );
    if (nextPosition) {
      console.log("Pacman",generateMovement(movementInQueue, current, nextPosition, start))
      return generateMovement(movementInQueue, current, nextPosition, start);
    }
  }
  if (direction) {
    const nextPosition: number | null = getNextValidPosition(
      gameMap,
      current,
      direction,
    );
    if (nextPosition) {
      return generateMovement(direction, current, nextPosition, start);
    }
  }
  return stayPut;
}

export function getOppositeDirection(defaultDirection: Direction): Direction {
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

export function autoMove(
  player: Player,
  autoMode: AutoModeType,
  map: GameMap, 
  target?: MapCell,
): Movement {
  let availableDirections: Direction[] = [
    Direction.UP,
    Direction.RIGHT,
    Direction.DOWN,
    Direction.LEFT,
  ];
  const { current,start } = player.movement.coordinates;
  const { direction } = player.movement;

  if (direction) {
    const forbiddenDirection = getOppositeDirection(direction);
    availableDirections = availableDirections.filter(
      (direction) => direction !== forbiddenDirection,
    );
  }

  const movements: Movement[] = availableDirections.map((direction) => {
    const nextPosition = getNextValidPosition(map, current, direction);
      return generateMovement(
        direction,
        current,
        nextPosition,
        start,
      );
  });

  const validMovements:Movement[] = movements.filter(movement => movement.coordinates.next !== null)

  if (autoMode === AutoModeType.SCARE) {
    return scareMove(validMovements);
  }
  return chaseMove(validMovements, target, map.cells);
  
}

export function scareMove(validMovements: Movement[]): Movement {
  const validDirectionLength: number = validMovements.length;
  const randomIndex = getRandomIndex(validDirectionLength);
  return validMovements[randomIndex];
}

export function chaseMove(
  validMovements: Movement[],
  target: MapCell,
  mapCells: MapCell[],
) {
  const shortestMovement: Movement = getShortestMovement(
    validMovements,
    target,
    mapCells,
  );
  return shortestMovement;
}

export function getRandomIndex(top: number): number {
  return Math.floor(Math.random() * top);
}

export function getShortestMovement(
  validMovements: Movement[],
  targetCell: MapCell,
  mapCells: MapCell[],
): Movement {
  let minDistance: number = Infinity;
  let index: number = Infinity;
  console.log("valid Movements", validMovements)
  validMovements.forEach((movement, i) => {
    const {next} = movement.coordinates
    const originCell = mapCells[next];
    const distance = calculateDistanceSquare(originCell.row,originCell.col, targetCell.row,targetCell.col);
    if (distance < minDistance) {
      minDistance = distance;
      index = i;
    }
  });
  return validMovements[index];
}

export function calculateDistanceSquare(
  o1Row:number,
  o1Col:number,
  o2Row:number,
  o2Col:number,
): number {
  const x2 = o2Row;
  const y2 = o2Col;

  const x1 = o1Row;
  const y1 = o1Col;

  const x_distance_square: number = Math.pow(x2 - x1, 2);
  const y_distance_square: number = Math.pow(y2 - y1, 2);
  return x_distance_square + y_distance_square;
}
