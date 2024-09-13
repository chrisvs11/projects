import { createUseStyles } from "react-jss";


export const UseStyle = createUseStyles({
    promotionBar:{
        minHeight:"60px",
        display:"flex",
        justifyContent:"space-around", 
        alignItems:"center",
        flexWrap:"wrap",
        marginInline:"auto"
    },
    promotionContainer:{
        display:"flex",
        justifyContent:"center", 
        alignItems:"center", 
        gap:"10px",
        margin:"10px",
        minWidth:"fit-content",
        flexBasis:"210px"
    },
    promotionCondition:{
        color:"gray",
        fontWeight:"600"
    },
    promotionTextContainer:{
        width:"100%", 
        display:"flex", 
        flexDirection:"column", 
        alignItems:"start",
    },
    promotion:{
        fontWeight:"bolder"
    },
    promotionIcon: {
        fontSize:"30px"
    }
  

})