import {atom} from "recoil"

import { GlobalState } from "../../types/state.type"


export const AuthState = atom<boolean>({
    key:GlobalState.AUTH,
    default:false
})