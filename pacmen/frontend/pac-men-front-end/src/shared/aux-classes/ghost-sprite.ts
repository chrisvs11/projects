import { Direction, GhostTypes, PlayerState } from "../types";

export class GhostSpriteSelector {
  private spriteOffsetYByDirection: { [key: string]: number } = {
    right: 0,
    down: 100,
    left: 200,
    up: 300,
  };

  private deadEyesOffsetY: { [key: string]: number } = {
    right: 0,
    down: 50,
    left: 100,
    up: 150,
  };

  private spriteOffsetXByGhostType: { [key: string]: number } = {
    blinky: 0,
    pinky: 50,
    inky: 100,
    clyde: 150,
    stinky: 200,
    purpky: 250,
  };

  private spriteOffsetYByScare: number = 550;

  private spriteOffsetByDead: { [key: string]: number } = {
    x: 300,
    y: 250,
  };

  getOffset = (
    state: PlayerState,
    type: GhostTypes,
    direction: Direction
  ): { x: number; y: number } => {
    if (state === PlayerState.ALIVE)

      return {
        x: this.spriteOffsetXByGhostType[type],
        y: this.spriteOffsetYByDirection[direction],
      };

    if (state === PlayerState.DEAD)

      return {
        x: this.spriteOffsetByDead["x"],
        y: this.deadEyesOffsetY[direction] + this.spriteOffsetByDead["y"],
      };

    if (state === PlayerState.SCARE)

      return {
        x: 0,
        y: this.spriteOffsetYByScare,
      };

    console.log("state not found", state, "of ghost", type);

    return { x: 0, y: 0 };
  };
}
