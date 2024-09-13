import { createUseStyles } from "react-jss";


export const useStyles = createUseStyles({
    tagContainerTitle:{
        fontWeight:"bolder"
    },
    tagsGridContainer: {
        display:"grid", 
        gridTemplateColumns:"repeat(auto-fit, minmax(auto,100px))", 
        boxSizing:"content-box", columnGap:"10px", rowGap:"10px", 
        marginTop:"5px", 
        minHeight:"50px", 
        maxHeight:"210px", 
        padding:"15px", 
        justifyContent:"center", 
        overflow:"auto",
    },
    category:{
        fontWeight:"bold"
    }
})