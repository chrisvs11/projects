export enum GhostType {
  BLINKY = "blinky",
  INKY ="inky",
  PINKY = "pinky",
  CLYDE = "clyde"
}


export enum GhostAvatar {
  "blinky" = "😈",
  "pinky" = "🦩",
  "inky" = "👾",
  "clyde" = "🦐"
}

export const npcSelector: {[key:string]:GhostType} = {
  ["blinky"]: GhostType.BLINKY,
  ["pinky"]:GhostType.PINKY,
  ["inky"]:GhostType.INKY,
  ["clyde"]:GhostType.CLYDE
}

export interface NPC {
  ghostName:GhostType,
}