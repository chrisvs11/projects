import { GameMoveQueue } from 'src/api/game/model';

import {
  generateMovement,
  getPlayerNextMovement,
} from '../game-aux-functions/movement-generator';

import {
  GameMap,
  GameRole,
  Movement,
  Player,
  PlayerCoordinates,
  PlayerState,
  npcSelector,
} from 'src/shared/types';

import { npcMoveSelector } from '../game-aux-functions/ghosts-npc-movement';
import { Pacman } from './pacman';

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
  private chaseMode: boolean;
  private inkyPlayerRefIndex: number;
  private timerId: NodeJS.Timeout;
  private areGhostsDead: boolean;

  constructor() {
    this.score = 0;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getAllCoordinates(): PlayerCoordinates[] {
    return this.players.map((player) => player.movement.coordinates);
  }

  getInkyRefPosition(): number {
    return this.players[this.inkyPlayerRefIndex].movement.coordinates.current;
  }

  setPlayers(pacmanId: number, players: Player[]): Player[] {
    this.players = players.filter((player) => player.id !== pacmanId);
    return this.players;
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
        this.inkyPlayerRefIndex = randomIndex;
        refPlayerSelected = true;
      }
    }
  }

  movementTypeSwitch() {
    const SCATTER_TIME = ACTION_TIME.SCATTER;
    const CHASE_TIME = ACTION_TIME.CHASE;
    this.chaseMode = false;

    const toggleMode = () => {
      this.chaseMode = !this.chaseMode;

      if (this.chaseMode) {
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

  changeGhostsState(ghostState: PlayerState, ghostId: number): void {
    const ghosts = this.players.map((player) => {
      if (player.id === ghostId) {
        player.state = ghostState;
        return player;
      } else {
        return player;
      }
    });

    this.players = ghosts;
  }

  getScore(): number {
    return this.score;
  }

  restartAll(): Movement[] {
    const initMovement: Movement[] = [];

    this.players = this.players.map((player) => {
      const { start } = player.movement.coordinates;
      const restartMovement: Movement = generateMovement(
        null,
        start,
        null,
        start,
      );
      initMovement.push(restartMovement);
      player.movement = restartMovement;
      return player;
    });

    return initMovement;
  }

  handleDeadGhosts() {
    console.log('Step: Checking if Ghosts can be revived...');

    if (!this.areGhostsDead) return;

    const ghosts = this.players.map((player) => {
      const { current, start } = player.movement.coordinates;
      if (player.state === PlayerState.GHOST_DEAD && current === start) {
        player.state = PlayerState.ALIVE;
      } else {
        return player;
      }
    });

    if (!ghosts.find((ghost) => ghost.state === PlayerState.GHOST_DEAD))
      this.areGhostsDead = false;

    this.players = ghosts;
  }

  returnToNormal() {
    const areScareGhosts: boolean = this.players.some(
      (player) => player.state === PlayerState.GHOST_SCARE,
    );

    if (areScareGhosts) {
      console.log('Power up Off...Ghost returning to normal...');
      this.players.forEach((player) =>
        this.changeGhostsState(PlayerState.ALIVE, player.id),
      );
    }
  }

  scareAllGhost() {
    console.log('Ghost entering scare state...');
    this.players.forEach((player) => {
      this.changeGhostsState(PlayerState.GHOST_SCARE, player.id);
    });
  }

  killGhost(...players: Player[]) {
    this.areGhostsDead = true;
    players.forEach((player) =>
      this.changeGhostsState(PlayerState.GHOST_DEAD, player.id),
    );
  }

  generateAllMovements(
    gameMap: GameMap,
    pacman: Pacman,
    currentMoveQueue: GameMoveQueue,
  ) {
    const inkyRefPosition = this.getInkyRefPosition();
    this.players.forEach((player, index) => {
      if (npcSelector[player.username]) {
        const movement = npcMoveSelector(
          player,
          pacman,
          gameMap,
          inkyRefPosition,
          this.chaseMode,
        );
        this.players[index].movement = movement;
      } else {
        this.players[index].movement = getPlayerNextMovement(
          gameMap,
          player,
          currentMoveQueue,
        );
      }
    });
  }

  updateAllCoordinates() {
    this.players.forEach((player) => {
      const playerCoordinates = player.movement.coordinates;
      if (playerCoordinates.next) {
        playerCoordinates.prev = playerCoordinates.current;
        playerCoordinates.current = playerCoordinates.next;
        playerCoordinates.next = null;
      }
    });
  }
}
