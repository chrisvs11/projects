import { SetStateAction } from "react";

export interface NumPropertyContainerProps {
    propertyTitle: string;
    propertyValue: number;
    propertyTop: any;
    propertyBottom: any;
    step: number;
    setProperty: (value: SetStateAction<any>) => void;
    className?:string
  }