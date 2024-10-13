import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { FirebaseService } from 'src/shared/services';

import { setInterval } from 'timers/promises';

import { GameMap, Direction, Collection } from 'src/shared/types';

import {
  calculateMachineTime,
  collisionHandler,
  gameOverCheck,
  getFinalGameState,
} from 'src/shared/game-aux-functions';

import { Lobby } from '../lobby/model';

import { Game, GameMoveQueue } from './model';

import { GameStartInput } from './dto';

import {
  GameBuilder,
  GameMapManager,
  Ghost,
  Pacman,
} from 'src/shared/game-aux-classes';

const FRAMES_PER_SECOND: number = 10;
@Injectable()
export class GameService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create({ lobbyId }: GameStartInput): Promise<Game> {
    const fetchLobby = (await this.firebaseService.getOneById(
      Collection.LOBBIES,
      lobbyId,
    )) as Lobby;

    const gameMapId = fetchLobby.mapId;
    const fetchMap = (await this.firebaseService.getOneById(
      Collection.MAPS,
      gameMapId,
    )) as GameMap;

    const gameBuilder = new GameBuilder();
    const newGameState = gameBuilder
      .addPlayers(fetchLobby.members)
      .pacmanRoulette()
      .addLives(fetchLobby.lives)
      .addPlayersToMap(fetchMap)
      .addPlaytime(fetchLobby.playtime)
      // .printMapLayout()
      .getGame();

    const gameInitState = (await this.firebaseService.createEntity(
      Collection.GAMES,
      newGameState,
    )) as unknown as Game;
    this.start(gameInitState);
    return gameInitState;
  }

  async start(game: Game) {
    let timeInSeconds = game.playtime;
    const gameID: string = game.id;
    const pacmanId: number = game.pacmanIndex + 1;
    const pacman = new Pacman(game.lives, game.numOfPellets);
    const ghosts = new Ghost();
    ghosts.setInkyRefPlayer(game.players);
    ghosts.movementTypeSwitch();
    const gameMapManager = new GameMapManager();

    setTimeout(async () => {
      try {
        for await (const _ of setInterval(1000 / FRAMES_PER_SECOND)) {
          //Phase 1: Get GameState from Firebase
          const phase1Start = performance.now();

          timeInSeconds -= 1 / FRAMES_PER_SECOND;
          const currentGameState: Game = await this.getGameState(gameID);
          const currentMoveQueue: GameMoveQueue =
            currentGameState.gameMoveQueue;
          const currentPlayers = currentGameState.players;
          pacman.setPlayer(pacmanId, currentPlayers);
          ghosts.setPlayers(pacmanId, currentPlayers);
          gameMapManager.setGameMap(currentGameState.map);

          const phase1End = performance.now();
          calculateMachineTime(phase1Start, phase1End, 'Get Firebase Update');

          //Phase 2: Update Players State in Game
          const phase2Start = performance.now();

          if (!pacman.getPowerUpStatus()) {
            pacman.returnToNormal();
            ghosts.returnToNormal();
          }
          ghosts.handleDeadGhosts();

          const phase2End = performance.now();
          calculateMachineTime(phase2Start, phase2End, 'Set Players');

          //Phase 3: Update players movement in map
          const phase3Start = performance.now();

          pacman.generateNextMovement(
            gameMapManager.getGameMap(),
            currentMoveQueue,
          );
          ghosts.generateAllMovements(
            gameMapManager.getGameMap(),
            pacman,
            currentMoveQueue,
          );

          gameMapManager.updateMap(pacman.getPlayer(), ...ghosts.getPlayers());

          pacman.updateCoordinates();
          ghosts.updateAllCoordinates();

          const phase3End = performance.now();
          calculateMachineTime(phase3Start, phase3End, 'Movement');

          //Phase 4: After Movement Effects
          const phase4Start = performance.now();

          const pacmanCell = pacman.getMapCell(
            gameMapManager.getGameMap(),
            'current',
          );
          pacman.eatItem(pacmanCell);
          if (pacman.getPowerUpStatus()) {
            ghosts.scareAllGhost();
          }
          collisionHandler(pacman, ghosts, gameMapManager);

          const phase4End = performance.now();
          calculateMachineTime(phase4Start, phase4End, 'After Movement Effect');

          //Phase 5: Send new game state to firebase
          const phase5Start = performance.now();
          const updateGameState = getFinalGameState(
            currentGameState,
            pacman,
            ghosts,
            gameMapManager,
          );

          await this.firebaseService.updateEntity(
            Collection.GAMES,
            game.id,
            updateGameState,
          );
          const phase5End = performance.now();
          calculateMachineTime(phase5Start, phase5End, 'Send Firebase Update');

          //Phase 6: End Game Steps
          const phase6Start = performance.now();
          console.log(`Game Time: ${timeInSeconds}`);
          const isGameOver = gameOverCheck(pacman, ghosts, timeInSeconds);

          if (isGameOver) {
            ghosts.stopNPCMoveMode();
            break;
          }
          const phase6End = performance.now();
          calculateMachineTime(phase6Start, phase6End, 'End Game');
          calculateMachineTime(phase1Start, phase6End, 'All Game');
          console.log('*********************************\n');
        }
      } catch (e) {
        console.error(`Error during game loop:`, e);
        ghosts.stopNPCMoveMode();
      }
    }, 3000);
  }

  async getGameState(gameUuid: string): Promise<Game> {
    try {
      const gameData: Game = (await this.firebaseService.getOneById(
        Collection.GAMES,
        gameUuid,
      )) as Game;
      return gameData;
    } catch (e) {
      console.error('Step: Start Getting Game State from Firebase Error: ', e);
    }
  }

  async putMoveToQueue(
    newDirection: Direction | null = null,
    playerId: number,
    gameUuid: string,
  ): Promise<Game> {
    console.log('Step: Putting Move to queue ...');
    const path: string = `gameMoveQueue.${playerId}`;

    try {
      console.log('Step: Putting Move to queue Completed');
      return await this.firebaseService.updateEntity(
        Collection.GAMES,
        gameUuid,
        { [path]: newDirection },
      );
    } catch (e) {
      throw new InternalServerErrorException(
        'Failed to updated player movement',
      );
    }
  }
}
