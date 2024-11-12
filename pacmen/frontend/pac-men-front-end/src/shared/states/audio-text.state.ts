import { atom } from "recoil";

import { GlobalStates } from "@/shared/types";

export const audioTextState = atom<string>({
    key:GlobalStates.AUDIOTXT,
    default: "🔊"
})