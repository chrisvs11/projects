import {atom} from "recoil"

import { GlobalState } from "../../types/state.type"


export const CategoryTargetState = atom<string[]>({
    key:GlobalState.CATEGORYTARGET,
    default:[]
})