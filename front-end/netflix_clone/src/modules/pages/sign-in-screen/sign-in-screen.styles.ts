import { createUseStyles } from "react-jss";


export const useStyle = createUseStyles({
  signUp_screen:{
    maxWidth:"500px",
    padding:"20px 70px",
    background:"rgba(0,0,0,0.85)",
    marginInline:"auto",
    borderRadius:"12px",
    width:"100%",
    '& form':{
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      width:"100%",
      alignItems:"center",
      '& input':{
        padding:"10px",
        border:"1px solid black",
        margin:"10px",
        color:"black",
        width:"100%"
      },
      '& h4':{
        width:"100%",
        textAlign:"left",
        marginTop:"6px",
        '& a':{
        transition:"all 0.2s",
        cursor:"pointer",
          '&:hover':{
            textDecoration:"underline"
          }
        }
      },
    }
  },

  signUp_btn:{
    background:"red",
    width:"100%",
    borderRadius:"6px",
    marginTop:"20px",
    fontWeight:"600",
    padding:"10px 15px",
    fontSize:"1rem"

  },

  signUp_gray:{
    color:"gray"
  }
})