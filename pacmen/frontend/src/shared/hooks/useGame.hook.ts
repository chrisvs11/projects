import { useRecoilState } from "recoil"

import { Game } from "../types"

import { gameState } from "../states"


export const useGame = () => {
        
    const[game,setGame] = useRecoilState<Game|null>(gameState)

    return {
        game,
        setGame
    }
}