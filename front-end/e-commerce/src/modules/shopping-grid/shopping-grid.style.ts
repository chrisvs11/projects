import { createUseStyles } from "react-jss";


export const useStyles = createUseStyles({
    shoppingGrid:{
        display:"grid",
        width:"100%", 
        gridTemplateColumns:"repeat(auto-fit, minmax(auto,200px))",
        rowGap:"1em",
        columnGap:"1em",
        overflow:"auto",
        maxHeight:"500px",
        padding:"15px",
        justifyContent:"center",
        background:"lightgrey",
        borderRadius:"10px"

    }
})