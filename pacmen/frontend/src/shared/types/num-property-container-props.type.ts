export interface NumPropertyContainerProps {
    propertyTitle: string;
    propertyValue: number;
    propertyTop: number;
    propertyBottom: number;
    step: number;
    setProperty: (value:number) => void;
    className?:string
  }