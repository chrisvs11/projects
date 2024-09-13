import {atom} from "recoil"

import { GlobalState } from "../../types/state.type"
import { maxValue } from "../../data"

export const PriceTargetValueState = atom<number>({
    key:GlobalState.PRICETARGET,
    default:maxValue.productPrice
})