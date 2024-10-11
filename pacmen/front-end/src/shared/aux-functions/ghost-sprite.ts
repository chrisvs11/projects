import { Direction, GhostTypes, PlayerState } from "../types";

export class GhostSpriteSelector {

   private spriteOffsetYByDirection: { [key: string]: number } = {
    right: 0,
    down: 100,
    left: 200,
    up: 300,
  };

  private spriteOffsetXByGhostType: { [key: string]: number } = {
    blinky: 0,
    pinky: 50,
    inky: 100,
    clyde: 150,
  };

  private spriteOffsetYByScare: number = 550;

  private spriteOffsetByDead: { [key: string]: number } = {
    x: 300,
    y: 250,
  };

  private eyesSpriteOffsetYByDirection: { [key: string]: number } = {
    right: 0,
    down: 50,
    left: 100,
    up: 150,
  };

  getOffsetX = (state: PlayerState, type: GhostTypes):number => {
   
    const newOffsetX:number =
      state === PlayerState.ALIVE
        ? this.spriteOffsetXByGhostType[type]
        : state === PlayerState.GHOST_DEAD
        ? this.spriteOffsetByDead["x"]
        : 0;

    return newOffsetX;
  };

  getOffsetY = (state:PlayerState,direction:Direction):number => {
    
    const newOffsetY:number =
    state === PlayerState.ALIVE
      ? this.spriteOffsetYByDirection[direction]
      : state === PlayerState.GHOST_SCARE
      ? this.spriteOffsetYByScare
      : this.spriteOffsetByDead["y"] + this.eyesSpriteOffsetYByDirection[direction];


    return newOffsetY

  }
}
