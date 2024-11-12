import { GameItem } from ".";

export const  pointsHash: { [key in GameItem]: number } = {
    [GameItem.CHERRY]: 100,
    [GameItem.EMPTY]: 0,
    [GameItem.PELLET]: 10,
    [GameItem.POWER_UP]: 50,
  };