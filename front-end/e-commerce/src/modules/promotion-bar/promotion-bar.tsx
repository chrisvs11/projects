import { Box, Icon } from "@chakra-ui/react";
import React, { FC } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { UseStyle } from "./promotion-bar.style";
import { IconContext } from "react-icons";
import { CiGift } from "react-icons/ci";
import { IoReload } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";



export const PromotionBar:FC = () => {

    const classes = UseStyle()

    return (
        <Box className={classes.promotionBar} >
            <div className={classes.promotionContainer} key={"p1"}>
                <IconContext.Provider value={{className:classes.promotionIcon}}>
                <Icon as={LiaShippingFastSolid} />
                </IconContext.Provider>
                <div className={classes.promotionTextContainer}>
                     <p className={classes.promotion}>FreeShipping</p>
                     <p className={classes.promotionCondition}>On orders over $150</p>
                </div>
            </div>
            <div className={classes.promotionContainer} key={"p2"}>
                <IconContext.Provider value={{className:classes.promotionIcon}}>
                <Icon as={CiGift} />
                </IconContext.Provider>
                <div className={classes.promotionTextContainer}>
                     <p className={classes.promotion}>Gift Cards</p>
                     <p className={classes.promotionCondition}>The perfect gift idea</p>
                </div>
            </div>
            <div className={classes.promotionContainer} key={"p3"}>
                <IconContext.Provider value={{className:classes.promotionIcon}}>
                <Icon as={IoReload} />
                </IconContext.Provider>
                <div className={classes.promotionTextContainer}>
                     <p className={classes.promotion}>100% satisfaction guarantee</p>
                     <p className={classes.promotionCondition}>Free return within 3 days</p>
                </div>
            </div>
            <div className={classes.promotionContainer} key={"p4"}>
                <IconContext.Provider value={{className:classes.promotionIcon}}>
                <Icon as={FaPhone} />
                </IconContext.Provider>
                <div className={classes.promotionTextContainer}>
                     <p className={classes.promotion}>Support 24/7</p>
                     <p className={classes.promotionCondition}>Customer support</p>
                </div>
            </div>
        </Box>
    )
}

