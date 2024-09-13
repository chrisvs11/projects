import { createUseStyles } from "react-jss";


export const useStyle = createUseStyles({

  next_btn:{
    color:"white",
    backgroundColor:"red",
    padding:"10px 15px",
    width:"100%",
    marginTop:"20px",
    borderRadius:"6px",
    fontWeight:"600",
    fontSize:"1rem",
    transition:"all 0.5s",
  },

  avatar_body:{
    '& h1':{
      fontSize:"1.5rem",
      marginBottom:"15px"
    }
    
  },

  avatar_container:{
    display:"flex",
    justifyContent:"space-around",
    alignItems:"center",
    padding:"10px",
    // background:"white",
    height:"200px",
    gap:"30px"
  },

  avatar:{
    height:"80px",
    cursor:"pointer",
    transition:"all 0.5s",
  },

  focused:{
    transform:"scale(1.2)",
    border:"1px solid white"
  },

  avatar_btn:{
    backgroundColor:"red",
    padding:"5px 15px",
    borderRadius:"5px",
    fontWeight:"600",
    '&:hover':{
      backgroundColor:"darkRed"
    }
  },

  errorBorder:{
    color:"red"
  }


})