import { atom } from "recoil";

import { GlobalStates } from "@/shared/types";

export const VolState = atom<number>({
    key:GlobalStates.AUDIO_VOL,
    default: 0.25
})