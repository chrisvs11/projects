import { ConflictException } from '@nestjs/common';

import {
  CellType,
  GameItem,
  GameRole,
  GameMap,
  Player,
  MapCell,
  Member,
  npcSelector,
  Direction,
  PlayerState,
} from 'src/shared/types';

import { Game } from 'src/api';

import { printMapLayout } from '../game-aux-functions';


export class GameBuilder {

  private conflictException: ConflictException;
  private players: Player[];
  private map: GameMap;
  private playtime: number;
  private lives: number;
  private pacmanIndex: number;

  constructor() {
    this.conflictException = new ConflictException('Game cannot be started');
    this.players = [];
    this.playtime = 5;
    this.lives = 3;
  }

  addPlayers(members: Member[]): GameBuilder {
    members.forEach((member) => {
      const player: Player = {
        id: this.players.length + 1,
        role: GameRole.GHOST,
        state: PlayerState.ALIVE,
        username: member.username,
        createdAt: new Date(),

        movement: {
          direction: null,
          coordinates: {
            current: null,
            next: null,
            start: null,
            prev:null
          },
        },
      };

      this.players.push(player);
    });

    console.log('Add participants: Done');
    return this;
  }

  addPlayersToMap(gameMap: GameMap) {
    this.map = gameMap;
    this.players.forEach((player) => {
      let startIndex: number = 0;
      switch (player.role) {
        case GameRole.GHOST:
          startIndex = this.map.cells.findIndex(
            (cell) => cell.type === CellType.GHOST_INIT,
          );
          break;
        case GameRole.PACMAN:
          startIndex = this.map.cells.findIndex(
            (cell) => cell.type === CellType.PACMAN_INIT,
          );
          break;
      }
      if (startIndex < 0) throw this.conflictException;
      const startCell = this.map.cells[startIndex];
      startCell.playerIds.push(player.id);
      player.movement.coordinates.current = startIndex;
      player.movement.coordinates.start = startIndex;
    });

    console.log('Add participants inside map: Done');
    return this;
  }

  addPlaytime(playtime: number): GameBuilder {
    this.playtime = playtime;
    console.log('Add playtime to the game: Done');
    return this;
  }

  addLives(lives: number): GameBuilder {
    this.lives = lives;
    return this;
  }

  countNumOfPellets(cells: MapCell[]): number {
    const numOfPellets = cells.filter(
      (cell) => cell.item === GameItem.PELLET,
    ).length;
    return numOfPellets;
  }

  private createGameMovQueue(): { [key: string]: Direction | null } {
    const moveQueue: { [key: string]: Direction | null } = {};

    this.players.forEach((player) => {
      if (!npcSelector[player.username]) {
        moveQueue[player.id] = null;
      }
    });

    return moveQueue;
  }

  pacmanRoulette(): GameBuilder {
    let randomIndex = Math.floor(Math.random() * this.players.length);

    let pacmanPlayer = this.players[randomIndex];
    while (npcSelector[pacmanPlayer.username]) {
      randomIndex = Math.floor(Math.random() * this.players.length);
      pacmanPlayer = this.players[randomIndex];
    }

    console.log(`Pacman is player number: ${randomIndex + 1}`);
    this.players[randomIndex].role = GameRole.PACMAN;
    this.pacmanIndex = randomIndex
    console.log('Pacman roulette: Done');
    return this;
  }

  getGame(): Game {
    const Game: Game = {
      createdAt: new Date(),
      players: this.players,
      map: this.map,
      playtime: this.playtime,
      pacmanIndex:this.pacmanIndex,
      lives: this.lives,
      pacmanScore: 0,
      ghostScore: 0,
      numOfPellets: this.countNumOfPellets(this.map.cells),
      gameMoveQueue: this.createGameMovQueue(),
    };
    console.log('Enjoy your game');
    return Game;
  }

  printMapLayout() {
    printMapLayout(this.map, this.players);
    return this;
  }
}
