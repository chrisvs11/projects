import { Coordinates, Direction, GameRole, MapTile, PlayerState, RecCoordinates } from ".";
export interface AvatarProps {
  offsetX: number;
  offsetY: number;
  coordinates: Coordinates;
  playerNum: number;
  ghostType:string;
  role: GameRole;
  state: PlayerState;
  direction?: Direction;
  scale?: number;
  mapTiles:MapTile[],
  cols:number,
  coordinatesToRecCoordinates: () => RecCoordinates
  className:string
}
