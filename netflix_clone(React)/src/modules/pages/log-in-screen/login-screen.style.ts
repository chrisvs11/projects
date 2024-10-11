import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({

  login_container:{
    position:"relative",
    height:"100%",
    background:"url(https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg) center no-repeat",
    backgroundSize:"cover"

  },

  login_background_container:{

  },

  login_background_gradient:{
    width:"100%",
    height:"100vh",
    zIndex:"1",
    background: "rgba(0,0,0,0.4)",
    backgroundImage:"linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)"
  },

  login_logo:{
    position:"fixed",
    width:120,
    left:20,
    top:20,
    objectFit:"contain",
    cursor:"pointer"
  },

  login_screen_btn:{
    position:"fixed",
    right:"20px",
    top:"20px",
    padding:"10px 20px",
    backgroundColor:"#e50914",
    color:"#fff",
    fontWeight:"600",
    borderRadius:"6px"
  },

  login_body:{
    zIndex:"1",
    color:"#fff",
    padding:"20px",
    marginBottom:"10px",
    marginInline:"auto",
    width:"100%",
    '& h1':{
      fontSize:"3.125rem",
    },
    position:"absolute",
    top:"30%",
    textAlign:"center",
    fontWeight:"600",
    '& h2':{
      fontSize:"2rem",
      fontWeight:"400",
      marginBottom:"30px"

    },
    '& h3':{
      fontSize:"1.3rem",
      fontWeight:"400"
    }
  },

  login_screen_input:{
    marginTop:"20px",
    padding:"10px",
    flexWrap:"wrap",
    width:"100%",
    '& form':{
      width:"100%",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      flexWrap:"wrap"
    },
    '& input':{
      padding:"20px",
      outline:"none",
      height:"30px",
      color:"black",
      border:"none",
      minWidth:"300px",
      maxWidth:"900px",

    }
  },

  login_screen_getStarted:{
    backgroundColor:"red",
    fontWeight:"600",
    padding:"6px 10px",
    fontSize:"1.2rem",
    border:"none",
    boxSizing:"content-box",
    minWidth:"100px",
    maxHeight:"30px"
  },

  

})