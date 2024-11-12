import { useRecoilState } from "recoil";

import { gameMapState } from "../states";

import { GameMap } from "../types";

export const useGameMap = () => {
    
    const[gameMap,setGameMap] = useRecoilState<GameMap|null>(gameMapState)

    return {
        gameMap,
        setGameMap
    }


}