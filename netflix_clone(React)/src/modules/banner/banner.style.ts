import { createUseStyles } from "react-jss";


export const useStyles = createUseStyles({
    banner:{
      position:"relative",
      height:"680px",
      color:"white",
      objectFit:"cover"
    },

    bannerContents:{
      marginLeft:"30px",
      paddingTop:"300px",
      height:"190px"
    },

    bannerTitle:{
      fontSize:"3rem",
      fontWeight:"800",
      paddingBottom:"0.3rem"
    },

    bannerDescription:{
      width:"45rem",
      lineHeight:"1.3",
      paddingTop:"1rem",
      fontSize:"0.8rem",
      maxWidth:"380px",
      height:"80px",
      textAlign:"justify"
    },

    bannerFadeButton:{
      height:"25rem",
      backgroundImage:"linear-gradient(180deg,transparent,rgba(37,37,37,0.611),#111)",

    },

    bannerButton:{
      cursor:"pointer",
      color:"white",
      border:"none",
      fontWeight:"700",
      borderRadius:"0.2vw",
      paddingLeft:"2rem",
      paddingRight:"2rem",
      marginRight:"1rem",
      paddingTop:"0.5rem",
      backgroundColor:"rgba(51,51,51,0.5)",
      paddingBottom:"0.5rem",
      '&:hover':{
        color:"#000",
        backgroundColor:"white",
        transition:"all 0.25s"
      }
    }
})