import { atom } from "recoil";

import { GlobalState } from "../../types/state.type";
import { CartItem } from "../../types";


export const GlobalCartState = atom<CartItem[]>({
    key:GlobalState.GLOBALCART,
    default:[]
})