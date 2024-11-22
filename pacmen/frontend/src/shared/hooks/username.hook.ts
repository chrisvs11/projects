"use client"
import { useRecoilState } from "recoil";

import { UsernameState } from "../states";

export const useUsername = () => {
    
    const[username,setUsername] = useRecoilState(UsernameState)

    return {
        username,
        setUsername
    }


}