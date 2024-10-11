import { useRecoilState } from "recoil";

import { LobbyIDState } from "../states";

export const useLobbyId = () => {
    
    const[lobbyId,setLobbyId] = useRecoilState<string>(LobbyIDState)

    return {
        lobbyId,
        setLobbyId
    }


}