import { createUseStyles } from "react-jss";

export const UseStyles = createUseStyles({

    categoryContainerWrapper:{
        minHeight:"fit-content",
        background:"red",
        display:"flex",
        justifyContent:"space-around",
        gap:"10px",
        alignItems:"center",
        flexWrap:"wrap",
        padding:"20px",
    },
    searchBarContainer:{
        width:"500px", 
        display:"flex", 
        alignItems:"center"
    },
    iconsContainer:{
        display:"flex",
        minWidth:"fit-content", 
        alignItems:"center", 
        scale:"1.2"

    },

})