import React, { FC, useCallback } from "react";
import { Link } from "../../shared/Components";
import { useStyles } from "./information-bar.style"
import { Button, border } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FaFacebook } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { PagesSwitch } from "../../types";
import { usePageState,useGlobalCartState,useAuthState } from "../../shared/hooks";



const informationBarLinks:string[]|any[] = ["My account", "Cart", "Check Out", <FaFacebook/>, <FaTwitterSquare/>, <FaInstagram/>]
const pagesHash:{[key:string]:PagesSwitch} = {
    "Cart":"shopping",
    "Check Out":"login"
}



export const InformationBar:FC = () => {

    const classes = useStyles()
    const {page,setPage} = usePageState()
    const {cart,setCart} = useGlobalCartState()
    const {auth,setAuth} = useAuthState()

    const updatePage = useCallback((info:string) => {

        switch(info) {
            case "Cart":
                setPage("cart")
                break;
            case "Check Out":
                setCart([])
                setAuth(false)
                setPage("login")
                break;
            default:
                alert("I do nothing")
        }

    },[page])

    return(
        <div className={`${auth?classes.flexWrapper:classes.wrapper} ${classes.header}`}>
            <div className={classes.container} >
                <div>
                    Call: 123-456-789
                </div>
                <div className={classes.division}>
                </div>
                <div>
                    County Hall, London SEI, UK
                </div>
            </div>
            <div className={`${classes.container} ${classes.linksBar}`}>
                {auth && informationBarLinks.map((infoLink: string,i,array) => {
                    return (
                    <div style={{display:"flex", alignItems:"center"}} key={`key-${i}`}>
                        <Button size="xs" variant="link" color="white" p="0px" fontSize={"16px"} onClick={() => updatePage(infoLink)}>{infoLink}</Button>
                        {i!==array.length-1 && <div className={classes.division}></div>}
                    </div>
                    )
                })}
            </div>

        </div>
    )
}