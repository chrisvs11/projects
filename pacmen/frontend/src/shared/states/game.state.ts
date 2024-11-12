import { atom } from "recoil";
import { Game, GlobalStates } from "../types";



export const gameState = atom<Game|null>({
    key:GlobalStates.GAME,
    default: null
})