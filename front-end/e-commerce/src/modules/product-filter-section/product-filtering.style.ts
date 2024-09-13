import { createUseStyles } from "react-jss";


export const useStyles = createUseStyles({
  productContainer:{
    display:"flex", 
    maxHeight:"500px",
    background:"red",
    gap:"20px",
    boxSizing:"content-box",
    padding:"15px",
  },
  formContainer:{
    display:"flex", 
    flexDirection:"column", 
    borderBottom:"1px solid lightgrey", 
    paddingBottom:"10px", 
    gap:"10px"
  }

})