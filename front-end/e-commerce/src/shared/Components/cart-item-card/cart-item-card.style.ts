import { createUseStyles } from "react-jss";    


export const useStyle = createUseStyles({
    changeQuantityIcon: {
        color:"blue",
        scale:"1.2",
        cursor:"pointer",
    },
    quantityContainer:{
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        height:"100%",
        gap:"10px",
        alignContent:"center"
    },
    child:{
        border:"1px solid red"
    }
})