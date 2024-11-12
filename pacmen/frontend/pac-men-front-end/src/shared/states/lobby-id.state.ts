import { atom } from "recoil";

import { GlobalStates } from "@/shared/types";

export const lobbyIDState = atom<string|null>({
    key:GlobalStates.LOBBY_ID,
    default:""
})