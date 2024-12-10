import { atom } from "recoil";

import { GlobalStates } from "@/shared/types";

export interface GameScore {
    pacmanScore:number,
    ghostScore:number,
}

export const GameScoresState = atom<GameScore>({
    key:GlobalStates.SCORES,
    default:{pacmanScore:0, ghostScore:0}
})