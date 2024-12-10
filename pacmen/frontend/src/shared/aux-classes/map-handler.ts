import { GameMap, MapTile } from "../types";

export class MapHandler {

    static getMapTile(gameMap:GameMap,index:number):MapTile {

        if(!gameMap.tiles[index]) throw new Error("Index out of bounds")

        return gameMap.tiles[index]
    }

}