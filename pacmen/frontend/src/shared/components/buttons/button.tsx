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



}

export const Button: FC<ButtonProps> = ({cKBtn,btnText,CKColorSchema="gray",cKSize="md",ckVariant="solid", cssStyle,className,type="button",onClick, disabled}) => {
    return (
        cKBtn ? 
        <BCK 
        className={className}
        colorScheme={CKColorSchema} 
        size={cKSize} 
        variant={ckVariant}
        style = {cssStyle}
        type={type}
        onClick={onClick}
        disabled
        >
            {btnText}
        </BCK>
        : <button disabled className={className} onClick={onClick}> {btnText}</button>
    )
}