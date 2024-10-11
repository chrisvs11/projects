import { GameItem, MapCell } from "src/shared/types";

import { GameMapManager, Ghost, Pacman } from ".";

export class GameMechanicsController {
    constructor() {}

    powerUpController(
        ghost: Ghost,
        pacman: Pacman,
        pacmanCell: MapCell,
      ): void {
        console.log('Step: Handle Power up...');
        if (pacmanCell.item !== GameItem.EMPTY) {
          switch (pacmanCell.item) {
            case GameItem.POWER_UP:
              pacman.powerUp();
              ghost.scareAllGhost();
              pacmanCell.item = GameItem.EMPTY;
              break;
            default:
              pacman.eatItem(pacmanCell);
              break;
          }
        }
      }

      
  collisionController(
    mapCell: MapCell,
    pacman: Pacman,
    ghost: Ghost,
    mapControl: GameMapManager,
  ): void {
    console.log('Step: handle Collision...');
    const pacPlayer = pacman.getPlayer();
    const ghostPlayers = ghost.getPlayers();
    const playerIdsInCell = mapCell.playerIds;
    const currentMapState = mapControl.getGameMap();

     if (playerIdsInCell.length > 1) {
      console.log('Collision Detected...');

      const affectedGhosts = ghostPlayers.filter(player => playerIdsInCell.includes(player.uuid))

      if(pacman.getPowerUpStatus()){
        pacman.eatGhost()
        affectedGhosts.forEach(player => ghost.killGhost(player.uuid))
      } else {
        ghost.caughtPacman()
        pacman.caught()
      }

      const pacmanLives = pacman.getLives()

      if(pacmanLives < 0) {
        pacman.killed();
        mapCell.playerIds = [pacPlayer.uuid];
        mapControl.setGameMap(currentMapState)
      } else {
        mapControl.clearCell(pacman.getCoordinates())
        const pacmanInitMovement = pacman.restart();
        const ghostsInitMovement = ghost.restartAll()
        mapControl.addPlayersMovementToMap(pacmanInitMovement,ghostsInitMovement)
      }
    }
  }

  gameOverController(
    pacman: Pacman,
    ghost: Ghost,
    timeInSeconds: number,
  ): boolean {
    if (pacman.getNumOfPellets() === 0) {
      console.log('Game Over, Pacman wins');
      console.log('🟡 👻 🟡');
      return true;
    }

    if (pacman.getLives() < 0) {
      console.log('Game Over, ghost wins!');
      console.log('👻 🟡 👻');
      return true;
    }

    if (timeInSeconds === 0) {
      console.log('GAME OVER');
      const winner: string =
        ghost.getScore() > pacman.getScore() ? 'Ghost' : 'Pacman';
      console.log(
        `The winner is ${winner} team. Pacman Score: ${pacman.getScore()} / Ghost score: ${ghost.getScore()}`,
      );
      return true;
    }

    return false;
  }

  
    
}