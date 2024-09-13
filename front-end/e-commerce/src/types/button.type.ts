import { CSSProperties } from "react"

export interface ButtonProps {
    buttonTxt?:string,
    buttonSize?:string,
    buttonVariants?:"solid"|"outline"|"ghost"|"link"
    colorScheme?:string
    hasLeftIcon?:boolean
    hasRightIcon?:boolean
    lIcon?:any
    rIcon?:any
    isTextIcon?:boolean
    textIcon?:any
    style?:CSSProperties
    className?:string
    notRound?:boolean
    submit?:boolean
    onClick?:() => void

}