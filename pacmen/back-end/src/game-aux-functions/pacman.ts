import {
  GameItem,
  GameMap,
  GameRole,
  MapCell,
  Movement,
  Player,
  PlayerState,
} from 'src/shared/types';
import { MovementAssistant } from './movement-generator';
import { Game, GameMoveQueue } from 'src/api/game/model';

enum POINTS {
  CHERRY = 250,
  PELLET = 50,
  GHOST = 500,
  POWER_UP = 100,
}

const POWER_UP_TIME = 20000;

export class Pacman {
  private lives: number;
  private score: number;
  private powerUpActive: boolean;
  private powerUpTimerId: NodeJS.Timeout;
  private numOfPellets: number;
  private player: Player;

  constructor(
    lives: number,
    numOfPellets: number,
    private movementManager: MovementAssistant,
  ) {
    this.score = 0;
    this.powerUpActive = false;
    this.lives = lives;
    this.numOfPellets = numOfPellets;
  }

  getPlayer(): Player {
    return this.player;
  }

  updatePlayer(pacmanId: number, gameState: Game): void {
    const currentPacman = gameState.players.find(
      (player) => (player.uuid = pacmanId),
    );
    this.player = currentPacman;
  }

  getScore(): number {
    return this.score;
  }

  getCoordinates(): number {
    return this.player.movement.coordinates.current;
  }

  getMapCell(GameMap:GameMap):MapCell {
    return GameMap.cells[this.getCoordinates()]
  }

  getNumOfPellets(): number {
    return this.numOfPellets;
  }

  getPowerUpStatus() {
    return this.powerUpActive;
  }

  getLives() {
    return this.lives;
  }

  eatItem(pacmanCurrentCell: MapCell): void {
    switch (pacmanCurrentCell.item) {
      case GameItem.CHERRY:
        console.log(`Pacman eat a ${GameItem.CHERRY}, got ${POINTS.CHERRY}`);
        this.score += POINTS.CHERRY;
        break;
      case GameItem.PELLET:
        console.log(`Pacman eat a ${GameItem.PELLET}, got ${POINTS.PELLET}`);
        this.score += POINTS.PELLET;
        this.numOfPellets--;
        break;
    }
    pacmanCurrentCell.item = GameItem.EMPTY;
  }

  returnToNormal() {
    this.player.role = GameRole.PACMAN;
    this.player.state = PlayerState.ALIVE;
  }

  powerUp() {
    console.log(`Pacman got a ${GameItem.POWER_UP}!, got ${POINTS.POWER_UP}`);

    this.score += POINTS.POWER_UP;

    console.log('PACMAN TIME!....GO GET THEM 😋👻');

    if (this.player.state !== PlayerState.PACMAN_POWER) {
      this.player.state = PlayerState.PACMAN_POWER;
    }

    this.powerUpActive = true;
    if (this.powerUpTimerId) {
      clearTimeout(this.powerUpTimerId);
    }

    this.powerUpTimerId = setTimeout(() => {
      console.log('Power up Time OUT...');
      this.powerUpActive = false;
    }, POWER_UP_TIME);
  }

  eatGhost(): void {
    console.log('eating ghost...Jum!');
    this.score += POINTS.GHOST;
    console.log(`Pacman ate a ghost, got ${POINTS.GHOST} points`);
  }

  caught() {
    this.lives--;
    console.log(`lives remaining: ${this.lives}`);
  }

  restart():Movement {
    const restartedMovement: Movement = {
      direction: {
        default: null,
      },
      coordinates: {
        current: this.player.movement.coordinates.start,
        next: null,
        start: this.player.movement.coordinates.start,
      },
    };

    this.player.movement = restartedMovement;

    return restartedMovement
  }

  killed() {
    console.log('Pacman got killed...');
    this.player.state = PlayerState.PACMAN_DEAD;
  }

  generateMovement(gameMap: GameMap, currentGameQueue: GameMoveQueue): Movement {
    const currentPacman = this.player;

    const pacmanMovement = this.movementManager.getPlayerNextMovement(
      gameMap,
      this.player,
      currentGameQueue,
    );

    currentPacman.movement = pacmanMovement;

    this.player = currentPacman;

    return pacmanMovement
  }

  adjustCoordinates() {

    const playerCoordinates = this.player.movement.coordinates;
    
    if (playerCoordinates.next) {
      playerCoordinates.current = playerCoordinates.next;
      playerCoordinates.next = null;
    }
  }
}
