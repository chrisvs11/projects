import { Game, GameMoveQueue } from 'src/api/game/model';

import { MovementAssistant, AutoModeType } from './movement-generator';

import {
  Direction,
  GameMap,
  GameRole,
  GhostType,
  MapCell,
  Movement,
  Player,
  PlayerCoordinates,
  PlayerDirection,
  PlayerState,
  npcSelector,
} from 'src/shared/types';

enum POINTS {
  CAUGHT = 1000,
  REVIVE = 250,
}

enum ACTION_TIME {
  CHASE = 37000,
  SCATTER = 20000,
}

export class Ghost {
  private score: number;
  private players: Player[];
  private scatterMode: boolean;
  private inkyRefPlayer: Player;
  private timerId: NodeJS.Timeout;

  constructor(private movementManager: MovementAssistant) {
    this.score = 0;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  updatePlayers(pacmanId: number, game: Game): void {

    // console.log('Step: Getting Current Ghosts State...');

    const currentGhostPlayers: Player[] = game.players.filter(
      (player) => player.uuid !== pacmanId,
    );

    this.players = currentGhostPlayers;

    // console.log('Step: Getting Current Ghosts State: Completed');
  }

  getCoordinates(): number[] {
    const coordinates: number[] = [];
    this.players.forEach((player) =>
      coordinates.push(player.movement.coordinates.current),
    );
    return coordinates;
  }

  setInkyRefPlayer(players: Player[]) {
    const inkyIndex = players.findIndex((player) => player.username === 'inky');
    if (inkyIndex < 0) return;
    let refPlayerSelected: boolean = false;
    while (!refPlayerSelected) {
      const randomIndex: number = Math.floor(Math.random() * players.length);
      const selectedPlayer = players[randomIndex];
      if (
        selectedPlayer.role === GameRole.GHOST &&
        selectedPlayer.username !== 'inky'
      ) {
        this.inkyRefPlayer = selectedPlayer;
        refPlayerSelected = true;
      }
    }
  }

  activateNPCMoveMode() {
    const SCATTER_TIME = ACTION_TIME.SCATTER;
    const CHASE_TIME = ACTION_TIME.CHASE;

    this.scatterMode = false;

    const toggleMode = () => {
      this.scatterMode = !this.scatterMode;

      if (this.scatterMode) {
        console.log('Scatter Mode Active');
        this.timerId = setTimeout(toggleMode, SCATTER_TIME);
      } else {
        console.log('Chase Mode Active');
        this.timerId = setTimeout(toggleMode, CHASE_TIME);
      }
    };

    toggleMode();
  }

  stopNPCMoveMode(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  caughtPacman(): void {
    console.log('Pacman was Caught');
    this.score += POINTS.CAUGHT;
  }

  changeTypeOfGhost(ghostState: PlayerState, ghost: Player): Player {
    return { ...ghost, state: ghostState };
  }

  getScore(): number {
    return this.score;
  }

  restartAll():Movement[] {

    const initMovement:Movement[] = []

    this.players = this.players.map((player) => {
      const { start } = player.movement.coordinates;

      const restartMovement:Movement = {
        direction:{
          default:null
        },
        coordinates:{
          current:start,
          next:null,
          start:start
        }
      }

      initMovement.push(restartMovement)
      player.movement = restartMovement
      return player
    });

    return initMovement
  }

  reviveGhosts() {
    console.log('Step: Checking if Ghosts can be revived...');

    const deadGhosts = this.players.filter(
      (player) => player.state === PlayerState.GHOST_DEAD,
    );

    deadGhosts.forEach((deadGhost) => {
      const deadGhostIndex = this.players.findIndex(
        (player) => player.uuid === deadGhost.uuid,
      );
      const { current, start } = deadGhost.movement.coordinates;
      const isInBase = current === start;

      if (isInBase) {
        console.log('Ghost have being revived...');
        const normalGhost = this.changeTypeOfGhost(
          PlayerState.ALIVE,
          deadGhost,
        );
        this.players[deadGhostIndex] = normalGhost;
      }
    });
  }

  returnToNormal() {
    const areScareGhosts: boolean = this.players.some(
      (player) => player.state === PlayerState.GHOST_SCARE,
    );

    if (areScareGhosts) {
      console.log('Power up Off...Ghost returning to normal...');
      this.players.forEach((player) => (player.state = PlayerState.ALIVE));
    }
  }

  scareAllGhost() {
    this.players.forEach((player) => {
      if (player.state === PlayerState.ALIVE) {
        player.state = PlayerState.GHOST_SCARE;
      }
    });
  }

  killGhost(ghostId) {
    const index = this.players.findIndex((player) => player.uuid === ghostId);
    this.players[index] = this.changeTypeOfGhost(PlayerState.GHOST_DEAD, {
      ...this.players[index],
    });
  }

  blinkyAutoMove(
    player: Player,
    pacPlayer: Player,
    gameMap: GameMap,
  ): Movement {
    //Blinky will target the pacman cell
    //Blinky scatter cell is the top right corner (row 1, col 27)
    const topRightIndex = gameMap.cols * 1 + gameMap.cols - 1;
    const scatterCell = gameMap.cells[topRightIndex];
    const currentPacmanCell =
      gameMap.cells[pacPlayer.movement.coordinates.current];

    if (this.scatterMode) {
      return this.movementManager.autoMove(
        player,
        AutoModeType.CHASE,
        scatterCell,
        gameMap,
      );
    } else {
      return this.movementManager.autoMove(
        player,
        AutoModeType.CHASE,
        currentPacmanCell,
        gameMap,
      );
    }
  }

  pinkyAutoMove(player: Player, pacPlayer: Player, gameMap: GameMap) {
    //Pinky will select the OFFSET tiles on the direction of pacman
    //Scatter cell is the top left corner (row 1, col 1)

    const topLeftIndex = gameMap.cols * 1 + 1;
    const scatterCell = gameMap.cells[topLeftIndex];
    const OFFSET = 4;
    const cols = gameMap.cols;
    const rows = gameMap.rows;
    const currentPacmanCell =
      gameMap.cells[pacPlayer.movement.coordinates.current];

    if (this.scatterMode) {
      return this.movementManager.autoMove(
        player,
        AutoModeType.CHASE,
        scatterCell,
        gameMap,
      );
    } else {
      console.log('moving on chaser mode. Pinky');
      const index = this.offsetIndexCalculator(
        pacPlayer,
        currentPacmanCell,
        OFFSET,
        cols,
        rows,
      );

      const targetCell = gameMap.cells[index];

      return this.movementManager.autoMove(
        player,
        AutoModeType.CHASE,
        targetCell,
        gameMap,
      );
    }
  }

  inkyAutoMove(
    player: Player,
    pacPlayer: Player,
    playerRef: Player,
    gameMap: GameMap,
  ) {
    //Inky will first find the second tile ahead of pacman,
    //Calculate the vector from pacman to a ref ghost player,
    //The target cell is the 2 tiles in from of pacman cell plus the 180 degrees rotation of the vector to ref player
    //The scatter cell is bottom left corner
    const pacmanCell = gameMap.cells[pacPlayer.movement.coordinates.current];
    const playerRefCell = gameMap.cells[playerRef.movement.coordinates.current];

    const OFFSET = 2;
    const cols = gameMap.cols;
    const rows = gameMap.rows;
    const bottomLeftIndex = gameMap.cols * (rows - 1) + 1;
    const scatterCell = gameMap.cells[bottomLeftIndex];

    if (this.scatterMode) {
      return this.movementManager.autoMove(
        player,
        AutoModeType.CHASE,
        scatterCell,
        gameMap,
      );
    } else {
      const index = this.offsetIndexCalculator(
        pacPlayer,
        pacmanCell,
        OFFSET,
        cols,
        rows,
      );

      const offsetCell = gameMap.cells[index];

      const transposeIndex = this.getIndexFromTransposeVector(
        offsetCell,
        playerRefCell,
        rows,
        cols,
      );

      const targetCell = gameMap.cells[transposeIndex];

      return this.movementManager.autoMove(
        player,
        AutoModeType.CHASE,
        targetCell,
        gameMap,
      );
    }
  }

  getIndexFromTransposeVector(
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

  clydeAutoMove(player: Player, pacPlayer: Player, gameMap: GameMap): Movement {
    //Clyde will target pacman until it enter the radius of influence, then it will target the scatter cell

    const RADIUS_INFLUENCE: number = 4;
    const pacCell = gameMap.cells[pacPlayer.movement.coordinates.current];
    const ghostCell = gameMap.cells[player.movement.coordinates.current];
    const distanceSquare = this.movementManager.calculateDistance(
      pacCell,
      ghostCell,
    );

    let targetCell = pacCell;
    const bottomRightIndex =
      gameMap.cols * (gameMap.rows - 1) + gameMap.cols - 1;
    const scatterCell = gameMap.cells[bottomRightIndex];

    if (this.scatterMode) {
      return this.movementManager.autoMove(
        player,
        AutoModeType.CHASE,
        scatterCell,
        gameMap,
      );
    } else {
      if (distanceSquare < Math.pow(RADIUS_INFLUENCE, 2)) {
        const index = (gameMap.rows - 1) * gameMap.cols + 3;
        targetCell = gameMap.cells[index];
      }
      return this.movementManager.autoMove(
        player,
        AutoModeType.CHASE,
        targetCell,
        gameMap,
      );
    }
  }

  private offsetIndexCalculator(
    pacPlayer: Player,
    pacmanCell: MapCell,
    Offset: number,
    cols: number,
    rows: number,
  ): number {
    let index: number = pacPlayer.movement.coordinates.current;
    let areSpacesLeftEnough: boolean;

    switch (pacPlayer.movement.direction.default) {
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

  private getGhostMovementDirection(
    player: Player,
    pacPlayer: Player,
    gameMap: GameMap,
  ): Movement {
    let finalDirection: Movement = null;

    switch (player.username) {
      case GhostType.BLINKY:
        finalDirection = this.blinkyAutoMove(player, pacPlayer, gameMap);
        break;

      case GhostType.PINKY:
        finalDirection = this.pinkyAutoMove(player, pacPlayer, gameMap);
        break;

      case GhostType.INKY:
        finalDirection = this.inkyAutoMove(
          player,
          pacPlayer,
          this.inkyRefPlayer,
          gameMap,
        );
        break;

      case GhostType.CLYDE:
        finalDirection = this.clydeAutoMove(player, pacPlayer, gameMap);
        break;

      default:
        console.error(`NPC ghost name not found ${player.username}`);
        finalDirection = null;
        break;
    }

    return finalDirection;
  }

  autoMoveSelector(
    player: Player,
    pacPlayer: Player,
    gameMap: GameMap,
  ): Movement {
    const homeCell = gameMap.cells[player.movement.coordinates.start];
    console.log(homeCell)
    console.log("pacPlayer",pacPlayer)
    const currentPacmanCell =
      gameMap.cells[pacPlayer.movement.coordinates.current];
  
    let autoMovement: Movement;
    switch (player.state) {
      case PlayerState.ALIVE:
        autoMovement = this.getGhostMovementDirection(
          player,
          pacPlayer,
          gameMap,
        );
        break;
      case PlayerState.GHOST_DEAD:
        autoMovement = this.movementManager.autoMove(
          player,
          AutoModeType.CHASE,
          homeCell,
          gameMap,
        );
        break;

      case PlayerState.GHOST_SCARE:
        autoMovement = this.movementManager.autoMove(
          player,
          AutoModeType.SCARE,
          currentPacmanCell,
          gameMap,
        );
        break;
      default:
        console.error(`Did not found any match of type, ${player.role}`);
        autoMovement = null;
        break;
    }

    return autoMovement;
  }

  generateMovementForAll(
    gameMap: GameMap,
    pacPlayer: Player,
    currentMoveQueue: GameMoveQueue,
  ): Movement[] {

    const movementArray:Movement[] = []
    this.players.forEach((player, index) => {
      if (npcSelector[player.username]) {
        const autoGeneratedMovement = this.autoMoveSelector(
          player,
          pacPlayer,
          gameMap,
        );
        this.players[index].movement = autoGeneratedMovement;
        movementArray.push(autoGeneratedMovement)
      } else {
        const playerMovement: Movement =
          this.movementManager.getPlayerNextMovement(
            gameMap,
            player,
            currentMoveQueue,
          );

        this.players[index].movement = playerMovement;
        movementArray.push(playerMovement)
      }
    });
    return movementArray
  }

  adjustCoordinatesForAll() {
    this.players.forEach((player) => {
      const playerCoordinates = player.movement.coordinates;
      if (playerCoordinates.next) {
        playerCoordinates.current = playerCoordinates.next;
        playerCoordinates.next = null;
      }
    });
  }
}
