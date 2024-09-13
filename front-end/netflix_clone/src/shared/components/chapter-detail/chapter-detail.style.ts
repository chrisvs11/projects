import { createUseStyles } from "react-jss";  


export const useStyles = createUseStyles({

  chapterDetail:{
    display:"flex",
    flexDirection:"column",
    gap:"20px",
    marginRight:"20px",
    paddingBottom:"50px"
  },

  chapterDetail_body:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(150px,auto))",
    columnGap:"20px",
    alignItems:"center",
    transition:"all 0.5s",
    cursor:"pointer",
    '&:hover':{
      background:"gray"
    },
    padding:"10px"
  },

  chapter_image:{
    height:"100px",
    objectFit:"contain",
    marginInline:"10px"
    
    
  },

  chapter_rightBody:{
    display:"grid",
    marginRight:"10px"
  },

  btn:{
    color:"black",
    display:"flex",
    justifyContent:"center",
    height:"40px",
    alignItems:"center",
    backgroundColor:"white",
    paddingInline:"15px",
    cursor:"pointer",
    '&:hover':{
      transform:"scale(1.25)",
      transition:"all 0.5s"
    },
    borderRadius:"6px",
  },

  chapterTitle:{
    fontWeight:"750",
    fontSize:"1rem"
  },

  chapterOverview:{
    fontWeight:"400",
    textAlign:"justify"

  },

  seasonSelector:{
    position:"sticky",
    top:"-10px"
  }


})