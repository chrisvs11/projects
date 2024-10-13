import {
  AutoModeType,
  Direction,
  GameMap,
  GhostType,
  Movement,
  Player,
  PlayerState,
} from 'src/shared/types';

import {
  autoMove,
  calculateDistanceSquare,
  generateMovement,
} from './movement-generator';

import {
  getTransposePosition,
  positionOffsetCalculator,
} from './position-helper';

import { Pacman } from '../game-aux-classes';

const PINKY_OFFSET: number = 4;
const CLYDE_RADIUS_INFLUENCE: number = 4;
const INKY_OFFSET: number = 2;

export function blinkyAutoMove(
  player: Player,
  pacman: Pacman,
  gameMap: GameMap,
  chaseMode: boolean,
): Movement {
  //Blinky will target the pacman cell
  //Blinky scatter cell is the top right corner (row 1, col 27)
  const topRightIndex = gameMap.cols * 1 + gameMap.cols - 1;
  const scatterCell = gameMap.cells[topRightIndex];
  const pacmanCell = pacman.getMapCell(gameMap, 'current');
  const targetCell = chaseMode ? pacmanCell : scatterCell;
  return autoMove(player, AutoModeType.CHASE, gameMap, targetCell);
}

export function pinkyAutoMove(
  player: Player,
  pacman: Pacman,
  gameMap: GameMap,
  chaseState: boolean,
): Movement {
  //Pinky will select the OFFSET tiles on the direction of pacman
  //Scatter cell is the top left corner (row 1, col 1)
  const topLeftIndex = gameMap.cols * 1 + 1;
  const scatterCell = gameMap.cells[topLeftIndex];
  const OFFSET = PINKY_OFFSET;
  const currentPacmanCell = pacman.getMapCell(gameMap, 'current');
  const direction = pacman.getDirection();
  const index = positionOffsetCalculator(
    direction,
    currentPacmanCell,
    OFFSET,
    gameMap,
  );

  const offsetCell = gameMap.cells[index];
  const targetCell = chaseState ? offsetCell : scatterCell;
  return autoMove(player, AutoModeType.CHASE, gameMap, targetCell);
}

export function clydeAutoMove(
  player: Player,
  pacman: Pacman,
  gameMap: GameMap,
  chaseState: boolean,
): Movement {
  //Clyde will target pacman until it enter the radius of influence, then it will target the scatter cell
  const bottomLeftIndex = gameMap.cols * (gameMap.rows - 1) + 1;
  const scatterCell = gameMap.cells[bottomLeftIndex];

  const pacmanCell = pacman.getMapCell(gameMap, 'current');
  const ghostCell = gameMap.cells[player.movement.coordinates.current];
  const distanceSquare = calculateDistanceSquare(
    pacmanCell.row,
    pacmanCell.col,
    ghostCell.row,
    ghostCell.col,
  );
  const radius_square = Math.pow(CLYDE_RADIUS_INFLUENCE, 2);

  const targetCell = chaseState
    ? distanceSquare <= radius_square
      ? scatterCell
      : pacmanCell
    : scatterCell;

  return autoMove(player, AutoModeType.CHASE, gameMap, targetCell);
}

export function inkyAutoMove(
  player: Player,
  pacman: Pacman,
  playerRefPosition: number,
  gameMap: GameMap,
  chaseState: boolean,
) {
  //Inky will first find the second tile ahead of pacman,
  //Calculate the vector from pacman to a ref ghost player,
  //The target cell is then 2 tiles in from of pacman cell plus the 180 degrees rotation of the vector to ref player
  //The scatter cell is bottom left corner
  const pacmanCell = pacman.getMapCell(gameMap, 'current');
  const direction = pacman.getDirection();
  const playerRefCell = gameMap.cells[playerRefPosition];
  const offset = INKY_OFFSET;
  const { cols, rows } = gameMap;
  const bottomRightIndex = cols * (rows - 1) + cols - 1;
  const scatterCell = gameMap.cells[bottomRightIndex];
  const offsetIndex = positionOffsetCalculator(
    direction,
    pacmanCell,
    offset,
    gameMap,
  );

  const offsetCell = gameMap.cells[offsetIndex];
  const transposeIndex = getTransposePosition(
    offsetCell,
    playerRefCell,
    rows,
    cols,
  );

  const transposeCell = gameMap.cells[transposeIndex];

  const targetCell = chaseState ? transposeCell : scatterCell;

  return autoMove(player, AutoModeType.CHASE, gameMap, targetCell);
}

export function npcMoveSelector(
  player: Player,
  pacman: Pacman,
  gameMap: GameMap,
  playerRefPosition: number,
  chaseState: boolean,
): Movement {
  const homeCell = gameMap.cells[player.movement.coordinates.start];
  const moveSelectorHash: { [key: string]: () => Movement } = {
    [PlayerState.ALIVE]: () =>
      getGhostMovementDirection(
        player,
        pacman,
        gameMap,
        playerRefPosition,
        chaseState,
      ),
    [PlayerState.GHOST_DEAD]: () =>
      autoMove(player, AutoModeType.CHASE, gameMap, homeCell),
    [PlayerState.GHOST_SCARE]: () =>
      autoMove(player, AutoModeType.SCARE, gameMap),
  };
  return moveSelectorHash[player.state]();
}

export function getGhostMovementDirection(
  ghost: Player,
  pacman: Pacman,
  gameMap: GameMap,
  playerRefPosition: number,
  chaseState: boolean,
): Movement {
  
  const npcMovementType: { [key: string]: () => Movement } = {
    [GhostType.BLINKY]: () =>
      blinkyAutoMove(ghost, pacman, gameMap, chaseState),
    [GhostType.PINKY]: () => pinkyAutoMove(ghost, pacman, gameMap, chaseState),
    [GhostType.INKY]: () =>
      inkyAutoMove(ghost, pacman, playerRefPosition, gameMap, chaseState),
    [GhostType.CLYDE]: () => clydeAutoMove(ghost, pacman, gameMap, chaseState),
  };
  const npcMovement: Movement = npcMovementType[ghost.username]();

  return npcMovement;
}
