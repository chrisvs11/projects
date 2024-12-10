import { atom } from "recoil";
import { GlobalStates } from "../types";



export const LogOutTimerState = atom<NodeJS.Timeout|null>({
    key:GlobalStates.LOGOUT,
    default: null
})