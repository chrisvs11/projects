import { atom } from "recoil";

import { GlobalStates } from "@/shared/types";

export const UsernameState = atom({
    key:GlobalStates.USERNAME,
    default: ""
})

