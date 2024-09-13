import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
   flexWrapper:{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-around",
        flexWrap:"wrap"

   },
   wrapper:{
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      flexWrap:"wrap"

   },
   header: {
      background:"#525253",
      minHeight:"35px",
      color:"white",

   },
   container:{
      display:"flex", 
      minWidth:"fit-content",
      alignItems:"center"
   },
   child:{
      border:"2px solid red",
      gap:"0px"
   },
   division:{
      minHeight:"25px",
      border:"1px solid gray",
      marginInline:"10px"
   },
   linksBar:{
      gap:"5px",
   }
})
