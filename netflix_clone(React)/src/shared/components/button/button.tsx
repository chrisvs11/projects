import {Button as CKButton} from "@chakra-ui/react";
import React, { FC } from "react";

interface ButtonProps {
  style?:boolean
  btnText?:string,
  btnClassName?:string
  onClick?:()=>void
  type?:"submit"|"reset"| "button" | undefined
}


export const Button:FC<ButtonProps> = ({type,style,btnText,btnClassName,onClick=()=>{}}) =>  {


  return (
    <>
      {style ? (
         <CKButton/>
      ): (
      <button className={btnClassName} type={type} onClick={onClick}>{btnText}</button>
      )}
    </>
  )
}