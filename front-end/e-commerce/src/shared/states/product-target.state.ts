import {atom} from "recoil"

import { GlobalState } from "../../types/state.type"


export const ProductTargetState = atom<string>({
    key:GlobalState.PRODUCTTARGET,
    default:""
})