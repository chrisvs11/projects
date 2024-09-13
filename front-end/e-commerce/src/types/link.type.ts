import { CSSProperties, FC } from "react"

export type LinkTarget = "_blank"|"_parent"|"_self"|"_top"

export interface LinkProps {
    linkContentText:string,
    target?:LinkTarget,
    href?:FC,
    styled?:boolean
    className?:string
    style?:CSSProperties
}