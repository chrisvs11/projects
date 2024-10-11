import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { FirebaseService } from 'src/shared/services';

import { setInterval } from 'timers/promises';

import {
  GameMap,
  GameRole,
  Direction,
  Collection,
  PlayerState,
  Movement,
} from 'src/shared/types';

import {
  GameMapManager,
  Ghost,
  MapRenderer,
  Pacman,
  GameStateManager,
  MovementAssistant,
  GameMechanicsController,
  GameBuilder,
} from 'src/game-aux-functions';

import { Lobby } from '../lobby/model';

import { Game, GameMoveQueue } from './model';

import { GameStartInput } from './dto';

@Injectable()
export class GameService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly gameStateManager: GameStateManager,
  ) {}

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

    const gameBuilder = new GameBuilder(new MapRenderer());

    const newGameState = gameBuilder
      .addPlayers(fetchLobby.members)
      .pacmanRoulette()
      .addLives(fetchLobby.lives)
      .addPlayersToMap(fetchMap)
      .addPlaytime(fetchLobby.playtime)
      .printMapLayout()
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
    const gameID: string = game.uuid;
    const pacmanId: number = game.players.find(
      (player) => player.role === GameRole.PACMAN,
    ).uuid;

    const pacman = new Pacman(
      game.lives,
      game.numOfPellets,
      new MovementAssistant(),
    );
    const ghosts = new Ghost(new MovementAssistant());
    const gameMechanicsController = new GameMechanicsController();

    ghosts.setInkyRefPlayer(game.players);
    ghosts.activateNPCMoveMode();

    const gameMapManager = new GameMapManager(new MapRenderer());
    const FRAMES_PER_SECOND: number = 10;

    setTimeout(async () => {
      try {
        for await (const _ of setInterval(1000 / FRAMES_PER_SECOND)) {
          //Phase 1: Get GameState from Firebase
          timeInSeconds -= 1 / FRAMES_PER_SECOND;
          const currentGameState: Game = await this.getGameState(gameID);
          const currentMoveQueue: GameMoveQueue =
            currentGameState.gameMoveQueue;
          pacman.updatePlayer(pacmanId, currentGameState);
          ghosts.updatePlayers(pacmanId, currentGameState);
          gameMapManager.setGameMap(currentGameState.map);

          //Phase 2: Update Players State in Game
          const isPacmanPowerUp = pacman.getPowerUpStatus();
          if (!isPacmanPowerUp) {
            pacman.returnToNormal();
            ghosts.returnToNormal();
          }

          const areDeadGhosts = ghosts
            .getPlayers()
            .some((player) => player.state === PlayerState.GHOST_DEAD);

          if (areDeadGhosts) ghosts.reviveGhosts();

          //Phase 3: Update players movement in map
          const pacmanNextMovement: Movement = pacman.generateMovement(
            gameMapManager.getGameMap(),
            currentMoveQueue,
          );
          console.log("pacmanMovement:", pacmanNextMovement)
          const ghostsNextMovement = ghosts.generateMovementForAll(
            gameMapManager.getGameMap(),
            pacman.getPlayer(),
            currentMoveQueue,
          );
          gameMapManager.addPlayersMovementToMap(
            pacmanNextMovement,
            ghostsNextMovement,
          );

          pacman.adjustCoordinates();
          ghosts.adjustCoordinatesForAll();

          //Phase 4: After Movement Effects
          const pacmanCell = pacman.getMapCell(gameMapManager.getGameMap());

          gameMechanicsController.powerUpController(ghosts, pacman, pacmanCell);

          gameMechanicsController.collisionController(
            pacmanCell,
            pacman,
            ghosts,
            gameMapManager,
          );

          //Phase 5: Send new game state to firebase
          const updateGameState = this.gameStateManager.getFinalGameState(
            currentGameState,
            pacman,
            ghosts,
            gameMapManager,
          );

          await this.firebaseService.updateEntity(
            Collection.GAMES,
            game.uuid,
            updateGameState,
          );

          //Phase 6: End Game Steps
          console.log(`Game Time: ${timeInSeconds}`);
          // gameMapManager.printMapLayout(updateGameState.players);

          const isGameOver = gameMechanicsController.gameOverController(
            pacman,
            ghosts,
            timeInSeconds,
          );

          if (isGameOver) {
            ghosts.stopNPCMoveMode();
            break;
          }
          console.log('*********************************\n');
        }
      } catch (e) {
        console.error(`Error during game loop: ${e}`);
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
