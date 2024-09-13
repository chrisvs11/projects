import User from 'types/user.type';
import { GlobalState } from '../../types/state.type';
import { atom } from "recoil";

export const ActiveUserState = atom<User>({
  key:GlobalState.ACTIVEUSER,
  default:undefined
})
