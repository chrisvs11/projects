import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
    flexWrapper:{
        display:"flex", 
        justifyContent:"center", 
        flexWrap:"wrap",
        minHeight:"100px"

    },
    logoContainer:{
        display:"flex",
        justifyContent:"space-around",
        minWidth:"fit-content",
        flexWrap:"wrap",
        alignItems:"center"
    },
    eContainer:{
        borderRadius:"50%",
        height:"60px",
        width:"60px",
        color:"white",
        backgroundColor:"red",
        fontSize:"50px",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
    },
    pagesContainer: {
        display: "flex", 
        justifyContent: "space-between",  
        alignItems:"center",
        minWidth:"fit-content", 
        gap:"25px"}
    }

)