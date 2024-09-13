import { atom } from "recoil";

import { GlobalState } from "../../types/state.type";
import { PagesSwitch } from "../../types";




export const GlobalPageState = atom<PagesSwitch>({
    key:GlobalState.PAGEMANAGMENT,
    default:"login"
})