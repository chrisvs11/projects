import { atom } from "recoil";

import { GameMap, GlobalStates } from "@/shared/types";

export const gameMapState = atom<GameMap>({
    key:GlobalStates.GAME_MAP,
    default: undefined
})