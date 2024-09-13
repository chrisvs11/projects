import { createUseStyles } from "react-jss";


export const useStyles = createUseStyles({
    searchBarContainer: {
        width:"100%",
        display:"flex"
    },
    input: {
        background:"#ffffff",
        borderRadius:"50px 0px 0px 50px",
    },
    addOn:{
        padding:"0",
        margin:"0",
        borderRadius:"0px",
        cursor:"pointer",
        background:"lightgrey",
    },
    icon:{
       padding:"0px",
       margin:"0px",
       width:"100%"

    }
})