import {
  CellType,
  GameItem,
  GameMap,
  GameRole,
  GhostAvatar,
  GhostType,
  Player,
  npcSelector,
  PlayerState,
} from 'src/shared/types';

export class MapRenderer {
  constructor() {}

  printMapLayout(map: GameMap, players: Player[]) {
    let layout = '';
    for (let i = 0; i < map.rows; i++) {
      let row = '';
      for (let j = 0; j < map.cols; j++) {
        const cell = map.cells.find((c) => c.row === i && c.col === j);
        //Render if there is a player
        if (cell?.playerIds?.length > 0) {
          const player: Player = players.find(
            (player) => player.uuid === cell.playerIds[0],
          );
          console.log(player, player.username, npcSelector[player.username])
          if (npcSelector[player.username]) {
            console.log("Printing by username")
            row = this.printByNPCName(row, player.username);
          } else {
            row = this.printByPlayerState(row, player.state, player.role === GameRole.PACMAN);
          }
        } else if (cell?.item) {
          row = this.printByGameItem(row, cell.item);
        } else {
          row = this.printByCellType(row,cell.type)
        }
      }
      layout += row.trim() + '\n';
    }

    console.log(layout);
  }

  printByPlayerState(row: string, state: PlayerState, pacman:boolean): string {
    switch (state) {
      case PlayerState.ALIVE:
        row += pacman ? `${GameRole.PACMAN}` : `${GameRole.GHOST}`;
        break;
      case PlayerState.PACMAN_DEAD:
        row += `${PlayerState.PACMAN_DEAD}`;
        break;
      case PlayerState.GHOST_DEAD:
        row += `${PlayerState.GHOST_DEAD}`;
        break;
      case PlayerState.GHOST_SCARE:
        row += `${PlayerState.GHOST_SCARE}`;
        break;
      case PlayerState.PACMAN_POWER:
        row += `${PlayerState.PACMAN_POWER}`;
        break;
      default:
        console.error(`No role found ${state}`);
        break;
    }
    return row;
  }

  printByNPCName(row: string, name: string): string {
    if (!npcSelector[name]) {
      return row;
    }
    switch (name) {
      case GhostType.BLINKY:
        row += `${GhostAvatar.blinky}`;
        break;
      case GhostType.CLYDE:
        row += `${GhostAvatar.clyde}`;
        break;
      case GhostType.INKY:
        row += `${GhostAvatar.inky}`;
        break;
      case GhostType.PINKY:
        row += `${GhostAvatar.pinky}`;
        break;
      default:
        console.log('Not an NPC');
        break;
    }
    return row;
  }

  printByGameItem(row: string, item: GameItem): string {
    switch (item) {
      case GameItem.CHERRY:
        row += `${GameItem.CHERRY}`;
        break;
      case GameItem.PELLET:
        row += `${GameItem.PELLET}`;
        break;
      case GameItem.POWER_UP:
        row += `${GameItem.POWER_UP}`;
        break;
      case GameItem.EMPTY:
        row += `${GameItem.EMPTY}`;
        break;
      default:
        row += '  ';
        break;
    }
    return row;
  }

  printByCellType(row: string, type: CellType): string {
    switch (type) {
      case CellType.WALL:
        row += `⬜`;
        break;
      case CellType.GHOST_INIT:
        row += `${CellType.GHOST_INIT}`;
        break;
      case CellType.PACMAN_INIT:
        row += `${CellType.PACMAN_INIT}`;
        break;
      case CellType.PATH:
        row += `${CellType.PATH}`;
        break;
      default:
        row += '  ';
        break;
    }
    return row;
  }
}
