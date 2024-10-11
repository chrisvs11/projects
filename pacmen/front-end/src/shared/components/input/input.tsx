import { ChangeEventHandler, CSSProperties, FC, HTMLInputTypeAttribute } from "react";
import { Input as Ck } from "@chakra-ui/react";

interface InputProps {
  ckStyle: boolean;
  name?: string;
  className: string;
  value?: string;
  size?: "xs" | "sm" | "md" | "lg";
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  style?:CSSProperties;
  onChange?: ChangeEventHandler<HTMLInputElement>
  error?:string
}
 

export const Input: FC<InputProps> = ({
  ckStyle,
  name,
  className,
  value,
  size = "md",
  placeholder = "",
  type = "text",
  onChange,
  style,
  error
}) => {

  const styles = {...style}

  if(error) styles["border"] = "1px solid red"


  return(
    <>
    {ckStyle ? (
      <Ck
        name={name}
        className={className}
        value={value}
        size={size}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        style={styles}
      />
    ) : (
      <input type={type} placeholder={placeholder} className={className} style={styles} />
    )}
    {error &&<span style={{color:"red"}}>{error? error:""}</span>}

    </>


  )
};
