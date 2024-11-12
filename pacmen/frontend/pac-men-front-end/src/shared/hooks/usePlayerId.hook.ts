"use client"
import { useRecoilState } from "recoil";

import { PlayerIdState} from "../states";

export const usePlayerId = () => {
    
    const[playerId,setPlayerId] = useRecoilState(PlayerIdState)

   return {
        playerId,
        setPlayerId
    }


}