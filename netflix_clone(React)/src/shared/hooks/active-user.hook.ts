import { useRecoilState } from "recoil";

import { ActiveUserState } from "shared/states";
import { USERDATABASE } from "shared/database/user.database";
import User from "types/user.type";

export const useActiveUser = () => {
  const [activeUser,setActiveUser] = useRecoilState(ActiveUserState)

  const changeActiveUser = (user:User):boolean => {
    const newUser = USERDATABASE.find(dbUser => dbUser.email === user.email)
    // console.log(newUser)
    if(newUser && newUser.password===user.password){
      setActiveUser(newUser)
      return true
    } else {
      return false
    }
  }

  return {
    activeUser,
    changeActiveUser,
    setActiveUser
  }
}