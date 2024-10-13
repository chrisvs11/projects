import {
  Direction,
  GameItem,
  GameMap,
  MapCell,
  Movement,
  Player,
  PlayerCoordinates,
  PlayerState,
} from 'src/shared/types';

import { GameMoveQueue } from 'src/api/game/model';

import { generateMovement, getPlayerNextMovement } from '../game-aux-functions/movement-generator';

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

  constructor(lives: number, numOfPellets: number) {
    this.score = 0;
    this.powerUpActive = false;
    this.lives = lives;
    this.numOfPellets = numOfPellets;  }

  getPlayer(): Player {
    return this.player;
  }

  getScore(): number {
    return this.score;
  }

  getCoordinates(): PlayerCoordinates {
    return this.player.movement.coordinates;
  }

  getMapCell(GameMap: GameMap,index:"current"|"next"|"next"): MapCell {
    const {current,prev,next} = this.getCoordinates()
    
    const indexHash:{[key:string]:number} = {
      "current": current,
      "next":next,
      "prev":prev
    }
    return GameMap.cells[indexHash[index]];
  }

  getDirection():Direction|null {
    return this.player.movement.direction
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

  setPlayer(pacmanId: number, players: Player[]): Player {
    this.player = players.find((player) => player.id === pacmanId);
    return this.player
  }

  eatItem(pacmanCurrentCell: MapCell): void {

    if(pacmanCurrentCell.item === GameItem.EMPTY) return 

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
      case GameItem.POWER_UP:
        console.log(`Pacman eat a ${GameItem.PELLET}, got ${POINTS.PELLET}`);
        this.score += POINTS.POWER_UP;
        this.powerUp();
        break;
    }
    
    pacmanCurrentCell.item = GameItem.EMPTY;
  }

  returnToNormal() {
    this.player.state = PlayerState.ALIVE;
  }

  powerUp() {
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
    if (this.lives >= 0) {
      this.restart();
    } else {
      this.killed();
    }
  }

  restart(): void {
    const {start} = this.player.movement.coordinates
    this.player.movement = generateMovement(null,start,null,start);;
  }

  killed() {
    console.log('Pacman got killed...');
    this.player.state = PlayerState.PACMAN_DEAD;
  }

  generateNextMovement(
    gameMap: GameMap,
    currentGameQueue: GameMoveQueue,
  ): Movement {
    const pacmanMovement = getPlayerNextMovement(
      gameMap,
      this.player,
      currentGameQueue,
    );
    this.player.movement = pacmanMovement;
    return pacmanMovement;
  }

  updateCoordinates() {
    const playerCoordinates = this.player.movement.coordinates;
    if (playerCoordinates.next) {
      playerCoordinates.prev = playerCoordinates.current
      playerCoordinates.current = playerCoordinates.next;
      playerCoordinates.next = null;
    }
    this.player.movement.coordinates = playerCoordinates
  }
}
