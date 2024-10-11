export interface ListPropertyContainerProps {
    propertyTitle: string;
    optionList: string[];
    optionValue:string
    setListValue: (value:any) => void;
    id?:string
  }
  