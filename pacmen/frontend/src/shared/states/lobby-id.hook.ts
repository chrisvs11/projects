import { atom } from "recoil";

import { GlobalStates } from "@/shared/types";

export const LobbyIDState = atom({
    key:GlobalStates.LOBBY_ID,
    default:""
})