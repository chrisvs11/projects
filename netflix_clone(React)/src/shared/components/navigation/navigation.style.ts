import { createUseStyles } from "react-jss"; 


export const useStyles = createUseStyles({
  nav:{
    position:"fixed",
    top:"0",
    padding:"10px",
    width:"100%",
    height:"60px",
    transitionTimingFunction:"ease-in",
    transition:"all 0.5s",
    zIndex:"10"
    
  },

  nav_black:{
    backgroundColor:"black",
    zIndex:"10"
  },

  nav_content:{
    display:"flex",
    justifyContent:"space-between"

  },

  nav_logo:{
    position:"fixed",
    left:0,
    width:80,
    objectFit:"contain",
    paddingLeft:20,
    cursor:"pointer",
    paddingTop:"10px"
  },

  nav_avatar:{
    position:"fixed",
    right:"20px",
    width:"30px",
    height:"30px",
    cursor:"pointer",
    paddingTop:"10px",
    objectFit:"contain"

  },

  search_form:{
    position:"fixed",
    right:"60px",
    top:"18px",
    color:"white",
    cursor:"pointer",
    display:"flex",
    alignItems:"center",
    gap:"5px",
    '& input':{
      color:"#111",
      borderRadius:"10px 0px 0px 10px",
      padding:"0px 10px"
    }
  
  },

  search_btn:{

  }
})