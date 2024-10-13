import { Player, PlayerCoordinates } from 'src/shared/types';
import { GameMapManager, Ghost, Pacman } from '../game-aux-classes';

export function collisionHandler(
  pacman: Pacman,
  ghost: Ghost,
  gameMapManager: GameMapManager,
): void {
  console.log('Step: handle Collision...');
  const pacPlayer = pacman.getPlayer();
  const ghostPlayers = ghost.getPlayers();

  const collisionGhosts: Player[] = getCollisionGhost(ghostPlayers, pacPlayer);
  console.log('Collision Ghosts: ', collisionGhosts);

  if (collisionGhosts.length > 0 && pacman.getPowerUpStatus()) {
    pacman.eatGhost();
    ghost.killGhost(...collisionGhosts);
  } else if (collisionGhosts.length > 0) {
    ghost.caughtPacman();
    pacman.caught();
    if (pacman.getLives() >= 0) {
      restartGame(pacman, ghost, gameMapManager);
    }
  }
}

function collisionDetector(
  playerCoordinates: PlayerCoordinates,
  ObjectCoordinates: PlayerCoordinates,
): boolean {
  const { current: pCurrent, next: pNext, prev: pPrev } = playerCoordinates;
  const { current: oCurrent, next: oNext, prev: oPrev } = ObjectCoordinates;
  const sameCellCollision = pCurrent === oCurrent;
  const passThroughCollision =
    pNext === oPrev && pPrev === oNext && pNext !== null;

  console.log(
    'SameCellCollision: ',
    sameCellCollision,
    'passCollision:',
    passThroughCollision,
  );
  return sameCellCollision || passThroughCollision;
}

function getCollisionGhost(
  ghostPlayers: Player[],
  pacPlayer: Player,
): Player[] {
  return ghostPlayers.filter((player) => {
    const collision: boolean = collisionDetector(
      player.movement.coordinates,
      pacPlayer.movement.coordinates,
    );
    if (collision) return player;
  });
}

export function restartGame(
  pacman: Pacman,
  ghost: Ghost,
  gameMapManager: GameMapManager,
) {
  pacman.restart();
  ghost.restartAll();
  gameMapManager.updateMap(pacman.getPlayer(), ...ghost.getPlayers());
}

export function gameOverCheck(
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
