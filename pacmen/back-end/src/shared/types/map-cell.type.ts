
export enum CellType {
  PACMAN_INIT = 'PH',
  GHOST_INIT = 'GH',
  WALL = 'W',
  PATH = '*',
}

export enum WallType {
  DOUBLE_UPPER_LEFT_CORNER    = 'LC',
  DOUBLE_LOWER_RIGHT_CORNER   = 'CL',
  DOUBLE_UPPER_RIGHT_CORNER   = 'RC',
  DOUBLE_LOWER_LEFT_CORNER    = 'CR',
  SIMPLE_UPPER_LEFT_CORNER    = 'lc',
  SIMPLE_LOWER_RIGHT_CORNER   = 'cl',
  SIMPLE_UPPER_RIGHT_CORNER   = 'rc',
  SIMPLE_LOWER_LEFT_CORNER    = 'cr',
  DOUBLE_STRAIGHT_LEFT_WALL   = '| ',
  DOUBLE_STRAIGHT_RIGHT_WALL  = ' |',
  SIMPLE_STRAIGHT_LEFT_WALL   = 'i|',
  SIMPLE_STRAIGHT_RIGHT_WALL  = '|i',
  DOUBLE_STRAIGHT_TOP_WALL    = 'T-',
  DOUBLE_STRAIGHT_BOTTOM_WALL = 'B-',
  SIMPLE_STRAIGHT_TOP_WALL    = 't-',
  SIMPLE_STRAIGHT_BOTTOM_WALL = 'b-',
  SHARP_UPPER_LEFT_CORNER =  "SL",
  SHARP_UPPER_RIGHT_CORNER = "SR",
  SHARP_LOWER_LEFT_CORNER = "RS",
  SHARP_LOWER_RIGHT_CORNER ="LS",
  LEFT_END = "E-",
  RIGHT_END = "-E"
}

const WallTypeHash: {[key:string]:WallType} = {
  "LC": WallType.DOUBLE_UPPER_LEFT_CORNER,
  "CL": WallType.DOUBLE_LOWER_RIGHT_CORNER,
  "RC": WallType.DOUBLE_UPPER_RIGHT_CORNER,
  "CR": WallType.DOUBLE_LOWER_LEFT_CORNER,
  "lc": WallType.SIMPLE_UPPER_LEFT_CORNER,
  "cl": WallType.SIMPLE_LOWER_RIGHT_CORNER,
  "rc": WallType.SIMPLE_UPPER_RIGHT_CORNER,
  "cr": WallType.SIMPLE_LOWER_LEFT_CORNER,
  "| ": WallType.DOUBLE_STRAIGHT_LEFT_WALL,
  " |": WallType.DOUBLE_STRAIGHT_RIGHT_WALL,
  "T-": WallType.DOUBLE_STRAIGHT_TOP_WALL,
  "B-": WallType.DOUBLE_STRAIGHT_BOTTOM_WALL,
  "|i": WallType.SIMPLE_STRAIGHT_RIGHT_WALL,
  "i|": WallType.SIMPLE_STRAIGHT_LEFT_WALL,
  "t-": WallType.SIMPLE_STRAIGHT_TOP_WALL,
  "b-": WallType.SIMPLE_STRAIGHT_BOTTOM_WALL,
  "SL": WallType.SHARP_UPPER_LEFT_CORNER,
  "SR": WallType.SHARP_UPPER_RIGHT_CORNER,
  "LS": WallType.SHARP_LOWER_RIGHT_CORNER,
  "RS": WallType.SHARP_LOWER_LEFT_CORNER,
  "E-": WallType.LEFT_END,
  "-E": WallType.RIGHT_END



}


export enum GameItem {
  CHERRY = '🍒',
  POWER_UP = '🔋',
  PELLET = '🟡',
  EMPTY = 'ㅤ',
}

export interface MapCell {
  row: number;
  col: number;
  playerIds?: number[];
  item?: GameItem;
  type: CellType;
  wallType?:string
}

export class Wall implements MapCell {
  row: number;
  col: number;
  type: CellType;
  wallType: string;

  constructor(row: number, col: number, wallType:string) {
    this.row = row;
    this.col = col;
    this.type = CellType.WALL;
    this.wallType = wallType
  }

  toPlainObject(): MapCell {
    return {
      row: this.row,
      col: this.col,
      type: this.type,
      wallType: this.wallType
    };
  }
}

export class Path implements MapCell {
  row: number;
  col: number;
  type: CellType;
  playerIds: number[];
  item: GameItem;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.type = CellType.PATH;
    this.item = GameItem.PELLET;
    this.playerIds = [];
  }

  toPlainObject(): MapCell {
    return {
      row: this.row,
      col: this.col,
      playerIds: this.playerIds,
      item: this.item,
      type: this.type,
    };
  }
}

export class PacmanBase implements MapCell {
  row: number;
  col: number;
  type: CellType;
  playerIds: number[];
  item: GameItem;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.type = CellType.PACMAN_INIT;
    this.item = GameItem.EMPTY;
    this.playerIds = [];
  }

  toPlainObject(): MapCell {
    return {
      row: this.row,
      col: this.col,
      playerIds: this.playerIds,
      item: this.item,
      type: this.type,
    };
  }
}
export class GhostBase implements MapCell {
  row: number;
  col: number;
  type: CellType;
  playerIds: number[];
  item: GameItem;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.type = CellType.GHOST_INIT;
    this.item = GameItem.EMPTY;
    this.playerIds = [];
  }

  toPlainObject(): MapCell {
    return {
      row: this.row,
      col: this.col,
      playerIds: this.playerIds,
      item: this.item,
      type: this.type,
    };
  }
}

export class PowerUpCell implements MapCell {
  row: number;
  col: number;
  type: CellType;
  playerIds: number[];
  item: GameItem;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.type = CellType.PATH;
    this.item = GameItem.POWER_UP;
    this.playerIds = [];
  }

  toPlainObject(): MapCell {
    return {
      row: this.row,
      col: this.col,
      playerIds: this.playerIds,
      item: this.item,
      type: this.type,
    };
  }
}

export class CherryCell implements MapCell {
  row: number;
  col: number;
  type: CellType;
  playerIds: number[];
  item: GameItem;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.type = CellType.PATH;
    this.item = GameItem.CHERRY;
    this.playerIds = [];
  }

  toPlainObject(): MapCell {
    return {
      row: this.row,
      col: this.col,
      playerIds: this.playerIds,
      item: this.item,
      type: this.type,
    };
  }
}

export class EmptyCell implements MapCell {
  row: number;
  col: number;
  type: CellType;
  playerIds: number[];
  item: GameItem.EMPTY;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.type = CellType.PATH;
    this.item = GameItem.EMPTY;
    this.playerIds = [];
  }

  toPlainObject(): MapCell {
    return {
      row: this.row,
      col: this.col,
      playerIds: this.playerIds,
      item: this.item,
      type: this.type,
    };
  }
}
