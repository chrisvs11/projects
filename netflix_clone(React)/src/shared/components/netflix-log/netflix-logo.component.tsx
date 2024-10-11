import React, { FC, useCallback } from "react";
import { imagesDataBase } from "images/images";
import { useNavigate } from "react-router-dom";

interface NetflixLogoProps {
  className?:string
  onClick?:()=>void
}

export const NetflixLogo:FC<NetflixLogoProps> = ({className,onClick}) => {
  const navigate = useNavigate()

  const clickHandler = useCallback(()=> {
    navigate("/")
    if(onClick){
      onClick()
    }
  },[navigate,onClick])


  return (
      <img className={className} data-testid="netflixLogo" src={imagesDataBase["netflix"]} alt="netflix logo" onClick={(() => clickHandler())}/>
  )
}