import { useRecoilState } from "recoil";

import { lobbyIDState } from "../states";

export const useLobbyId = () => {
    
    const[lobbyId,setLobbyId] = useRecoilState<string|null>(lobbyIDState)

    return {
        lobbyId,
        setLobbyId
    }


}