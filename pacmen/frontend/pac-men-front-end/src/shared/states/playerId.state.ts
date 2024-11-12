import { atom } from "recoil";

import { GlobalStates } from "@/shared/types";

export const PlayerIdState = atom({
    key:GlobalStates.PLAYER_ID,
    default:""
})