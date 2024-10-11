"use client"
import { useRecoilState } from "recoil";

import { UsernameState } from "../states";
import { useEffect, useState } from "react";

export const useUsername = () => {
    
    const[username,setUsername] = useRecoilState(UsernameState)

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "")
    },[])



    return {
        username,
        setUsername
    }


}