import { createUseStyles } from "react-jss";

export const useStyle = createUseStyles({
  movieBanner:{
    position:"absolute",
    top:"400px",
    left:"50%",
    transform:"translate(-50%,-50%)",
    background:"#111",
    height:"500px",
    minWidth:"400px",
  },

  movieContent:{
    paddingTop:"150px",
    marginLeft:"10%",
  },

  movieTitle:{
    color:"white",
    fontSize:"2rem",
    fontWeight:"900"
  },

  banner_btn:{
    display:"flex",
    gap:"5px",
    marginBottom:"20px"
  },

  btn:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#111",
    border:"none",
    color:"white",
    paddingInline:"15px",
    cursor:"pointer",
    '&:hover':{
      backgroundColor:"white",
      color:"black",
      transition:"all 0.5s"
    },
    borderRadius:"6px",
  },

  icon_container:{
    display:"flex",
    backgroundColor:"#111",
    border:"none",
    color:"white",
    height:"30px",
    paddingInline:"15px",
    fontSize:"1.2rem",
    alignItems:"center",
    gap:"5px",
    borderRadius:"6px",
  },

  icon:{
    cursor:"pointer",
    color:"gray",
    '&:hover':{
      transform:"scale(1.3)",
      color:"white"
    },
    transition:"all 0.5s",
  },

  buttonFader:{
    height:"16rem",
    backgroundImage:"linear-gradient(180deg,rgba(37,37,37,0.8),#111)",
    color:"white",
    display:"grid",
    gridTemplateColumns:"1fr 0.5fr",
    columnGap:"25px",
    padding:"10px",
  },
  buttonFaderContent:{
    display	:"flex",
    flexDirection:"column",
  },

  movieDescription:{
    paddingLeft:"5px",
    height:"15px",
    fontSize:"1rem",
    textAlign:"justify"
  },

  title: {
    fontSize:"0.8rem",
    color:"lightgrey",
  },

  movieMetaData:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    objectFit:"contain",
    gap:"20px",
    boxSizing:"content-box",
    marginRight:"20px"
  },

  closeBtn:{
    position:"fixed",
    right:"20px",
    borderRadius:"50%",
    color:"white",
    background:"#111",
    paddingInline:"7px",
    marginTop:"10px",
    transition:"all 0.25s",
    '&:hover':{
      color:"black",
      background:"white"
    }
  },

  chapter_row:{
    background:"#111",
    color:"white",
    width:"100%",
    '& select':{
      padding:"10px",
      background:"#111",
      right:"20px",
      marginLeft:"10px",
      border:"none"

    },
    maxHeight:"600px",
    overflowY:"scroll",
    overflowX:"none"
  }

})