import { atom } from "recoil";

import { GlobalStates } from "@/shared/types";

export const PelletsState = atom<number>({
    key:GlobalStates.PELLETS,
    default: 99999
})