import { createUseStyles } from "react-jss";


export const useStyles = createUseStyles({
    sliderCard:{
        minHeight:"60px",
        display:"flex", 
        alignItems:"center", 
        justifyContent:"center",
        border:"none",
        boxShadow:"none",
        paddingInline:"20px",
        height:"120px"
    },
    sliderTitle:{
        minHeight:"50px",
        fontWeight:"bolder"
    },
    labelStyle:{
        marginTop:"5px",
        marginLeft:"-16px",
        fontSize:"sm",
        color:"tomato"
    },
    markStyle:{
        textAlign:"center",
        color:"black",
        marginTop:"-35px",
        marginLeft:"-18px",
        width:"12"
    },
})