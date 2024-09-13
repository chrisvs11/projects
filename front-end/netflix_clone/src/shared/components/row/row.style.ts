import { createUseStyles } from "react-jss";

export const useStyle = createUseStyles({
  row:{
    color:"white",
    '& h2':{
      fontWeight:"900",
      marginLeft:"15px"
    },
    height:"auto",
    paddingTop:"50px"
  },



  rowPosters:{
    display:"flex",
    overflowY:"hidden",
    overflowX:"auto",
    padding:"20px",
    width:"100%",
    '&::-webkit-scrollbar':{
      display:"none"
    },
    'scrollbar-width': 'none' ,
    '-ms-overflow-style':"none",

  },
  rowPoster:{
    maxHeight:"100px",
    objectFit:"contain",
    marginRight:"10px",
 
    transition: "transform 450ms",
    '&:hover':{
      transform: "scale(1.08)",
      opacity:"1"
    }

  },
  rowPosterLarge:{
    maxHeight:"250px",
    '&:hover':{
      transform:"scale(1.09)",
      opacity:"1"
    }
  }
})