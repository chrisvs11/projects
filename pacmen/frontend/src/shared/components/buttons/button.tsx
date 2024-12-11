import { Button as BCK } from "@chakra-ui/react";
import { CSSProperties, FC } from "react";

export interface ButtonProps {
    cKBtn:boolean,
    btnText:string,
    className:string,
    CKColorSchema?:string,
    cKSize?:string,
    ckVariant?:"solid"|"outline"|"ghost"|"link",
    cssStyle?:CSSProperties
    type?:"button"|"submit"|"reset"|undefined
    onClick?:() => void
    disabled?:boolean
    id?:string;



}

export const Button: FC<ButtonProps> = ({cKBtn,btnText,CKColorSchema="gray",cKSize="md",ckVariant="solid", cssStyle,className,type="button",onClick,disabled,id}) => {
    return (
        cKBtn ? 
        <BCK 
        id={id}
        className={className}
        colorScheme={CKColorSchema} 
        size={cKSize} 
        variant={ckVariant}
        style = {cssStyle}
        type={type}
        onClick={onClick}
        disabled = {disabled || false }
        >
            {btnText}
        </BCK>
        : <button id={id} disabled={disabled||false} className={className} onClick={onClick}> {btnText}</button>
    )
}