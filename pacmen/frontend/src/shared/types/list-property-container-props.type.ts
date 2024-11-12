export interface ListPropertyContainerProps {
    propertyTitle: string;
    optionList: string[];
    optionValue:string
    setListValue: (value:number) => void;
    id?:string
    className:string
  }
  