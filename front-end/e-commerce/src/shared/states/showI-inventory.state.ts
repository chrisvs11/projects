import {atom} from "recoil"

import { GlobalState } from "../../types/state.type"
import { Inventory, SellingItem } from "../../data"

export const ShownInventoryState = atom<SellingItem[]>({
    key:GlobalState.SHOWNINVENTORY,
    default:Inventory
})