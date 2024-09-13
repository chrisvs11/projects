import { IconType } from "react-icons"

export interface SliderProps {

    sliderTitle:string,
    minValue:number,
    maxValue:number,
    step:number,
    markIcon?:IconType,
    defaultValue?:number
    sliderValue?:number
    setSliceValue:React.Dispatch<React.SetStateAction<number>>


}