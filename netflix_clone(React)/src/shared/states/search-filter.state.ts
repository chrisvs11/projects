import { GlobalState } from '../../types/state.type';
import { atom } from "recoil";

export const SearchFilterState = atom<string>({
  key:GlobalState.SEARCHINPUT,
  default:""
})
